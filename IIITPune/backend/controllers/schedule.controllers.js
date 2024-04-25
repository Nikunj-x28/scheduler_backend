import {asyncHandler} from '../utils/asyncHandler.js'
import {Course} from "../models/course.model.js"
import {Department} from "../models/department.model.js"
import {Instructor} from "../models/instructor.model.js"
import {Meeting} from "../models/meeting.model.js"
import {Room} from "../models/room.model.js"
import {Section} from "../models/section.model.js"

const getSchedule = asyncHandler( async ( req, res ) =>
{

    const POPULATION_SIZE = 10
    const NUMB_OF_ELITE_SCHEDULES = 1
    const TOURNAMENT_SELECTION_SIZE = 3
    const MUTATION_RATE = 0.1
    class Data
    {
        constructor ()
        {
            this._rooms = []; // This will be populated with MongoDB query results
            this._meetingTimes = []; // This will be populated with MongoDB query results
            this._instructors = []; // This will be populated with MongoDB query results
            this._courses = []; // This will be populated with MongoDB query results
            this._depts = []; // This will be populated with MongoDB query results
            this._sections = [];
        }

        async fetchData ()
        {
            // MongoDB queries here to fetch data
            try
            {
                this._rooms = await Room.find();
                this._courses = await Course.find();
                this._depts = await Department.find();
                this._instructors = await Instructor.find();
                let meetings = await Meeting.find();
                const week = [ 'mon', 'tue', 'wed', 'thur', 'fri' ];
                for ( const day of week )
                {
                    for ( let i = 0; i < meetings.length; i++ )
                    {
                        meetings[ i ].day = day;
                    }
                }
                this._meetingTimes = meetings;
                this._sections = await Section.find();
            } catch ( error )
            {
                console.error( 'Error fetching data:', error );
                throw new Error( 'Failed to fetch data from MongoDB' );
            }
        }

        get_sections ()
        {
            return this._sections;
        }

        get_rooms ()
        {
            return this._rooms;
        }

        get_instructors ()
        {
            return this._instructors;
        }

        get_courses ()
        {
            return this._courses;
        }

        get_depts ()
        {
            return this._depts;
        }

        get_meetingTimes ()
        {
            return this._meetingTimes;
        }
    }

    class Schedule
    {
        // Constructor for the Schedule class
        constructor ()
        {
            // Initialize instance variables
            this._classes = []; // Array to store classes
            this._numberOfConflicts = 0; // Number of conflicts in the schedule
            this._fitness = -1; // Fitness score of the schedule initially set to -1 to indicate no fitness has been calculated
            this._classNumb = 0; // Counter for class numbers
            this._isFitnessChanged = true; // Flag to track if fitness has changed
        }

        // Getter method for classes
        getClasses ()
        {
            // If fitness has changed, indicate that fitness needs to be recalculated
            this._isFitnessChanged = true;
            // Return the array of classes
            return this._classes;
        }

        // Getter method for the number of conflicts
        get_numbOfConflicts ()
        {
            // Return the number of conflicts
            return this._numberOfConflicts;
        }

        // Getter method for fitness
        getFitness ()
        {
            // If fitness has changed, recalculate it
            if ( this._isFitnessChanged )
            {
                this._fitness = this.calculate_fitness();
                this._isFitnessChanged = false;
            }
            // Return the fitness score
            return this._fitness;
        }

        // Method to initialize the schedule
        async initialize ()
        {
            // Get all sections from the data
            const sections = data.get_sections();
            // Get all rooms from the data
            const rooms = data.get_rooms();
            // Create a copy of the rooms array to manipulate
            let availableRooms = [ ...rooms ];
            // Iterate over each section
            for ( const section of sections )
            {
                // Get the department of the section
                const deptId = section.departmentName;
                const dept = await Department.findById( deptId )
                // Get all courses in the department
                const coursesId = dept.courses;
                let courses = [];
                try
                {
                    for ( const courseId of coursesId )
                    {
                        const course = await Course.findById( courseId ); // Find course by its ObjectId
                        if ( course )
                        {
                            courses.push( course ); // Push the found course to the courses array
                        } else
                        {
                            console.log( `Course with id ${ courseId } not found` );
                        }
                    }
                } catch ( error )
                {
                    console.error( 'Error retrieving courses:', error );
                }
                // Find a room with sufficient capacity for the section
                // also make sure there is no wastage of space
                let minDiff = Infinity;
                let suitableRoomIndex = -1;
                for ( let i = 0; i < availableRooms.length; i++ )
                {
                    const room = availableRooms[ i ];
                    if ( room.capacity >= section.capacity )
                    {
                        const diff = room.capacity - section.capacity;
                        if ( diff < minDiff )
                        {
                            minDiff = diff;
                            suitableRoomIndex = i;
                        }
                    }
                }
                // If no suitable room is found, throw an error
                if ( suitableRoomIndex === -1 )
                {
                    throw new Error( `No room with sufficient capacity for section ${ section.id }` );
                }
                // Get the suitable room
                const room = availableRooms[ suitableRoomIndex ];
                // Remove the room from the available rooms
                availableRooms.splice( suitableRoomIndex, 1 );
                // Iterate over each course
                for ( const course of courses )
                {
                    // Get the credit for the course
                    const credit = course.credit;
                    // Distribute classes evenly among courses
                    for ( let i = 0; i < credit; i++ )
                    {
                        // Create a new class instance
                        const newClass = new Class( this._classNumb, dept, section, course );
                        // Increment class number
                        this._classNumb++;
                        // Set meeting time for the class randomly
                        newClass.setMeetingTime( data.get_meetingTimes()[ Math.floor( Math.random() * data.get_meetingTimes().length ) ] );
                        // Set room for the class
                        newClass.setRoom( room );
                        // Set instructor for the class
                        const instructorname = await Instructor.findById( course.instructor )
                        newClass.setInstructor( instructorname );
                        // Add the new class to the array of classes
                        this._classes.push( newClass );
                    }
                }
            }
            // now calculate fitness
            this.getFitness();
            // Return the initialized schedule
            return this;
        }

        // Method to calculate the fitness of the schedule
        calculate_fitness ()
        {
            // Reset the number of conflicts
            this._numberOfConflicts = 0;
            // Get all classes in the schedule
            const classes = this.getClasses();
            // Iterate over each class
            for ( let i = 0; i < classes.length; i++ )
            {
                // Iterate over each class again to check for conflicts with other classes
                for ( let j = i; j < classes.length; j++ )
                {
                    // SECTION CONSTRAINTS
                    //  same time same day two courses for a section
                    if ( classes[ i ].meeting_time.startTime === classes[ j ].meeting_time.startTime &&
                        classes[ i ].meeting_time.day === classes[ j ].meeting_time.day &&
                        classes[ i ].section === classes[ j ].section )
                    {
                        this._numberOfConflicts++;
                    }
                    // one course taught only once to each section in a day
                    if ( classes[ i ].meeting_time.day === classes[ j ].meeting_time.day &&
                        classes[ i ].section === classes[ j ].section &&
                        classes[ i ].course.name === classes[ j ].course.name )
                    {
                        this._numberOfConflicts++;
                    }

                    // INSTRUCTOR CONSTRAINT
                    // same time same day two sections for an instructor
                    if ( classes[ i ].meeting_time.startTime === classes[ j ].meeting_time.startTime &&
                        classes[ i ].meeting_time.day === classes[ j ].meeting_time.day &&
                        classes[ i ].instructor === classes[ j ].instructor &&
                        classes[ i ].section.sectionId !== classes[ j ].section.sectionId )
                    {
                        this._numberOfConflicts++;
                    }
                }
            }
            // Calculate the fitness score (inverse of the number of conflicts)
            return 1 / ( 1.0 * ( this._numberOfConflicts + 1 ) );
        }
    }

    class Population
    {
        constructor ( size )
        {
            this._size = size;
            this._schedules = []
        }
        increaseSize ()
        {
            this._size = this._size + 1
        }
        async initializeSchedules ()
        {
            for ( let i = 0; i < this._size; i++ )
            {
                let schedule = new Schedule();
                await schedule.initialize();
                this._schedules.push( schedule );
            }
        }
        getSchedules ()
        {
            return this._schedules;
        }
    }

    class Class
    {
        constructor ( id, dept, section, course )
        {
            this.class_id = id;
            this.department = dept;
            this.course = course;
            // instructor is not an object
            this.instructor = null;
            this.meeting_time = null;
            this.room = null;
            this.section = section;
        }

        getId ()
        {
            return this.class_id;
        }

        getDept ()
        {
            return this.department;
        }

        getCourse ()
        {
            return this.course;
        }

        getInstructor ()
        {
            return this.instructor;
        }

        getMeetingTime ()
        {
            return this.meeting_time;
        }

        getRoom ()
        {
            return this.room;
        }

        setInstructor ( instructor )
        {
            this.instructor = instructor;
        }

        setMeetingTime ( meetingTime )
        {
            this.meeting_time = meetingTime;
        }

        setRoom ( room )
        {
            this.room = room;
        }
    }

    class GeneticAlgorithm
    {
        async evolve ( currentPopulation )
        {
            let newPopulation = await this._crossover_population( currentPopulation );
            newPopulation = await this._mutate_population(newPopulation );
            return newPopulation;
        }

        async _crossover_population ( currentPopulation )
        {
            const crossoverPop = new Population( 0 );
            for ( let i = 0; i < NUMB_OF_ELITE_SCHEDULES; i++ )
            {
                crossoverPop.getSchedules().push( currentPopulation.getSchedules()[ i ] );
                crossoverPop.increaseSize();
            }
            let i = NUMB_OF_ELITE_SCHEDULES;
            while ( i < POPULATION_SIZE )
            {
                const pop1 = await this._select_tournament_population( currentPopulation );
                const pop2 = await this._select_tournament_population( currentPopulation );
                const newSchedule =this._crossover_schedule( pop1.getSchedules()[ 0 ],pop2.getSchedules()[ 0 ] ) 
                crossoverPop.getSchedules().push( newSchedule );
                crossoverPop.increaseSize()
                i++;
            }
            return crossoverPop;
        }

        async _mutate_population ( population )
        {
            for ( let i = NUMB_OF_ELITE_SCHEDULES; i < POPULATION_SIZE; i++ )
            {
                await this._mutate_schedule( population.getSchedules()[ i ] );
            }
            return population;
        }

        _crossover_schedule ( schedule1, schedule2 )
        {
            const crossoverSchedule =new Schedule();
            for ( let i = 0; i < schedule1.getClasses().length; i++ )
            {
                if ( Math.random() > 0.5 )
                {
                    crossoverSchedule.getClasses().push(schedule1.getClasses()[ i ]);
                } else
                {
                    crossoverSchedule.getClasses().push(schedule2.getClasses()[ i ]);
                }
            }
            crossoverSchedule.getFitness();
            return crossoverSchedule;
        }

        async _mutate_schedule ( mutateSchedule )
        {
            const schedule = new Schedule();
            await schedule.initialize();
            for ( let i = 0; i < mutateSchedule.getClasses().length; i++ )
            {
                if ( MUTATION_RATE > Math.random() )
                {
                    mutateSchedule.getClasses()[ i ] = schedule.getClasses()[ i ];
                }
            }
            return mutateSchedule;
        }

        async _select_tournament_population ( currentPopulation )
        {
            const tournamentPop = new Population( 0 );
            let i = 0;
            while ( i < TOURNAMENT_SELECTION_SIZE )
            {
                tournamentPop.getSchedules().push( currentPopulation.getSchedules()[ Math.floor( Math.random() * POPULATION_SIZE ) ] );
                tournamentPop.increaseSize();
                i++;
            }
            tournamentPop.getSchedules().sort( ( a, b ) => b.getFitness() - a.getFitness() );
            return tournamentPop;
        }
    }


    async function timetable ()
    {
        let schedule = [];
        let population = new Population( POPULATION_SIZE );
        await population.initializeSchedules();
        let generationNum = 0;
        population.getSchedules().sort( ( a, b ) => b.getFitness() - a.getFitness() );
        let geneticAlgorithm = new GeneticAlgorithm();
        console.log( population.getSchedules()[0].getFitness())
        while ( population.getSchedules()[ 0 ].getFitness() !== 1.0 && generationNum<5)
        {
            generationNum++;
            console.log( '\n> Generation #' + generationNum );
            population = await geneticAlgorithm.evolve( population );
            population.getSchedules().sort( ( a, b ) => b.getFitness() - a.getFitness() );
            schedule = population.getSchedules()[ 0 ].getClasses();
            console.log(population.getSchedules()[ 0 ].getFitness());
        }
        console.log( "hogya bhai yees yees" )
        return schedule

    }
    const data = new Data();
    await data.fetchData();
    timetable()
} )
export
{
    getSchedule
}

