const {Lesson, Skill, Chapter, User} = require("../models")
const {ERR_STATUS, ERR_CODE, Lesson_Sort} = require("../constants/constant")

const fileupload = require("../utilities/upload")
const path = require('path')
const mongoose = require("mongoose")
const statusCodes = require("http-status-codes")
const db = mongoose.connection

const createLesson = async function (request, response) {
    const {
        subject,
        icon,
        name,
        shortDescription,
        description,
        cost,
        difficulty,
        medias,
        skills,
        visibility,
        entry,
        setupScreenshots,
        setupInstructions,
        setupFiles,
    } = request.body;

    // Name should be atleast 4 character
    if (name.length < 4) {
        errorStatus = true
        response.status(statusCodes.BAD_REQUEST).send({
            err_code: statusCodes.BAD_REQUEST,
            message: "Name should be atleast 4 character"
        })
    }
    // Icon url should be atleast 4 character

    // atleast one media file is required


    const session = await db.startSession();
    const responses = {};

    var lesson = Lesson()
    lesson.subject = subject ? subject : lesson.subject
    lesson.icon = icon ? icon : lesson.icon
    lesson.name = name ? name : lesson.name
    lesson.shortDescription = shortDescription ? shortDescription : lesson.shortDescription
    lesson.description = description ? description : lesson.shortDescription
    lesson.cost = cost ? cost : lesson.cost
    lesson.difficulty = difficulty ? difficulty : lesson.difficulty
    lesson.medias = medias ? medias : lesson.medias
    lesson.skills = skills ? skills : lesson.skills
    if (visibility === true) {
        lesson.visibility = true

    } else {
        lesson.visibility = false
    }
    lesson.entry = entry ? entry : lesson.entry
    lesson.setupScreenshots = setupScreenshots ? setupScreenshots : lesson.setupScreenshots
    lesson.setupInstructions = setupInstructions ? setupInstructions : lesson.setupInstructions
    lesson.setupFiles = setupFiles ? setupFiles : lesson.setupFiles
    lesson.rating = 0
    lesson.chapters = []
    lesson.createdBy = request.user._id

    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    try {
        const transactionResults = await session.withTransaction(async () => {
            // save collection document
            const createdLesson = await lesson.save({session})
            responses['lesson'] = createdLesson
            if (createdLesson) {
                const lessonCreator = await User.findById({_id: request.user._id, session})
                lessonCreator.lessons = lessonCreator.lessons.concat(createdLesson._id)
                updatedList = lessonCreator.save({session})
                if (!updatedList) {
                    response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                        err_code: statusCodes.INTERNAL_SERVER_ERROR,
                        message: "Sorry we were not able to update lesson list for this user"
                    })
                }
            }

            if (skills) {
                for (var i = 0; i < skills.length; i++) {
                    const skillName = skills[i]
                    result = await Skill.findOne({name: skillName})
                    if (result) {
                    } else {
                        var skill = Skill()
                        skill.name = skills[i]
                        createdSkills = await skill.save({session})
                    }
                }
            }
        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.CREATED).send(responses)

        } else {
            console.log("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Sorry we were not able to create this lesson"
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to create this lesson",
            internalError: err

        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}
const updateLesson = async function (request, response) {

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };

    try {

        var lessonUpdated = false
        var newSkillAdded = false
        var responses = {}

        const transactionResults = await session.withTransaction(async () => {

            const currentLesson = await Lesson.findById({_id: request.body.lesson_id, session})
            if (currentLesson) {

                currentLesson.icon = request.body.icon ? request.body.icon : currentLesson.icon
                currentLesson.name = request.body.name ? request.body.name : currentLesson.name
                currentLesson.subject = request.body.subject ? request.body.subject : currentLesson.subject
                currentLesson.shortDescription = request.body.shortDescription ? request.body.shortDescription : currentLesson.shortDescription
                currentLesson.description = request.body.description ? request.body.description : currentLesson.description
                currentLesson.cost = request.body.cost ? request.body.cost : currentLesson.cost
                currentLesson.skills = request.body.skills ? request.body.skills : currentLesson.skills
                currentLesson.difficulty = request.body.difficulty ? request.body.difficulty : currentLesson.difficulty
                currentLesson.medias = request.body.medias ? request.body.medias : currentLesson.medias
                if (request.body.visibility === true) {
                    currentLesson.visibility = true
                } else {
                    currentLesson.visibility = false
                }
                currentLesson.visibility = request.body.visibility ? request.body.visibility : currentLesson.visibility
                currentLesson.entry = request.body.entry ? request.body.entry : currentLesson.entry
                currentLesson.setupScreenshots = request.body.setupScreenshots ? request.body.setupScreenshots : currentLesson.setupScreenshots
                currentLesson.setupInstructions = request.body.setupInstructions ? request.body.setupInstructions : currentLesson.setupInstructions
                currentLesson.setupFiles = request.body.setupFiles ? request.body.setupFiles : currentLesson.setupFiles
                currentLesson.rating = request.body.rating ? request.body.rating : currentLesson.rating
                currentLesson.chapters = request.body.chapters ? request.body.chapters : currentLesson.chapters
                currentLesson.updatedAt = new Date()

                updatedLesson = await currentLesson.save({session})
                if (updatedLesson) {
                    lessonUpdated = true
                    responses['lesson'] = updatedLesson
                    if (request.body.skills) {
                        skills = request.body.skills
                        for (var i = 0; i < skills.length; i++) {
                            const skillName = skills[i]
                            result = await Skill.findOne({name: skillName})

                            if (result) {
                            } else {
                                var skill = Skill()
                                skill.name = skills[i]
                                createdSkills = await skill.save({session})
                                if (createdSkills) {
                                    newSkillAdded = true
                                }
                            }
                        }
                    }
                } else {
                    response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                        err_code: statusCodes.INTERNAL_SERVER_ERROR,
                        message: "Could not update this lesson"
                    })
                }
            } else {
                response.status(statusCodes.NOT_FOUND).send({err_code: 0, "message": "This lesson does not exist"})
            }
            // save collection document
        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            if (newSkillAdded) {
                responses['message'] = "New Skills were added"
            }
            response.status(statusCodes.OK).send(responses)
        } else {
            console.log("The transaction was intentionally aborted.");
            response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                err_code: statusCodes.INTERNAL_SERVER_ERROR,
                message: "Could not update this lesson"
            })
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this lesson",
            internalError: err
        })
        console.log("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}
const searchLesson = function (request, response) {
    var {
        query,
        sort,
        fields,
    } = request.body;

    var sortField = {"name": 1}
    var difficulty = 0
    if (sort == null) {
        sort = Lesson_Sort.Newest
    }

    switch (sort) {
        case Lesson_Sort.Newest:
            sortField = {"createdAt": -1}
            break
        case Lesson_Sort.Oldest:
            sortField = {"createdAt": 1}
            break
        case Lesson_Sort.Highest_Avg:
            sortField = {"rating": -1}
            break
        case Lesson_Sort.Lowest_Avg:
            sortField = {"rating": 1}
            break
        case Lesson_Sort.Intro:
            difficulty = Difficulty.Intro
            break
        case Lesson_Sort.Beginner:
            difficulty = Difficulty.Beginner
            break
        case Lesson_Sort.Intermediate:
            difficulty = Difficulty.Intermediate
            break
        case Lesson_Sort.Advanced:
            difficulty = Difficulty.Advanced
            break
    }

    var condition = {}
    if (query && query != "") {
        condition["name"] = {$regex: query, $options: 'i'}
    }
    if (difficulty) {
        condition["difficulty"] = difficulty
    }

    if (fields == null || fields == "") {
        fields = 'name shortDescription icon medias rating createdAt'
    }

    Lesson.find(condition, fields, {sort: sortField}).limit(100).find(function (err, lessons) {
        if (err != null) {
            response.status(ERR_STATUS.Bad_Request).json({
                error: err
            });
        } else {
            response.json({
                err_code: ERR_CODE.success,
                lessons
            });
        }
    });
}
const deleteLessonById = async function (request, response) {
    try {
        lessons = await Lesson.findOne({_id: request.params.id})
        if (lessons) {
            deletedLesson = await Lesson.deleteOne({_id: request.params.id})
            if (deletedLesson) {
                response.status(statusCodes.OK).send({err_code: 0, message: "The lesson was deleted successfully"})
            } else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: 0,
                    message: "Could not delete this lesson"
                })
            }

        } else {
            response.status(statusCodes.NOT_FOUND).send({err_code: 0, message: "This lesson does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not delete this lesson",
            internalError: error
        })
    }

}
const addChapterToLesson = async function (request, response) {

    const session = await db.startSession();
    const transactionOptions = {
        readPreference: 'primary',
        readConcern: {level: 'local'},
        writeConcern: {w: 'majority'}
    };
    responses = {}
    try {

        var chapterExistFlag = false
        const transactionResults = await session.withTransaction(async () => {

            const currentLesson = await Lesson.findById({_id: request.body.lesson_id, session})
            if (currentLesson) {
                chapter = request.body.chapter_id
                const chapterExist = currentLesson.chapters.find(element => element === request.body.chapter_id);

                if (chapterExist) {
                    chapterExistFlag = true
                    session.endSession()
                    return
                } else {
                    currentLesson.chapters = currentLesson.chapters.concat(chapter)
                    updatedLesson = await currentLesson.save({session});
                    if (updatedLesson) {
                        responses['lesson'] = updatedLesson
                    }
                }
            } else {
                response.status(200).send({err_code: 0, "message": "This lesson does not exist"})
            }
            // save collection document
        }, transactionOptions)
        if (transactionResults) {
            responses['err_code'] = 0
            response.status(statusCodes.OK).send(responses)
        } else {
            if (chapterExistFlag) {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: statusCodes.INTERNAL_SERVER_ERROR,
                    message: "This chapter already added to this lesson"

                })
            } else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                    err_code: statusCodes.INTERNAL_SERVER_ERROR,
                    message: "Sorry we were not able to update this lesson"
                })
            }
            console.error("The transaction was intentionally aborted.");
        }
    } catch (err) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Sorry we were not able to update this lesson",
            internalError: err

        })
        console.error("The transaction was aborted due to an unexpected error: " + err);
    } finally {
        session.endSession();
    }
}
const getLessonById = async function (request, response) {
    try {
        lessons = await Lesson.findById({_id: request.params.id})
        if (lessons) {
            response.status(statusCodes.OK).send({err_code: 0, lessons})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: 0,
                lessons: {},
                message: "This lesson does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch lesson",
            internalError: error
        })
    }

}
const getPublicOrPrivateLesson = async function (request, response) {
    try {
        lessons = await Lesson.find(
            {visibility: request.body.visibility})
        if (lessons) {
            response.status(statusCodes.OK).send({err_code: 0, lessons})
        } else {
            response.status(statusCodes.NOT_FOUND).send({
                err_code: 0,
                lessons: {},
                message: "This lesson does not exist"
            })
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch lesson",
            internalError: error
        })
    }

}
const getChaptesByLessonId = async function (request, response) {
    try {
        allChaptersId = []
        lesson = await Lesson.findById({_id: request.params.id})
        if (lesson) {
            allChapters = lesson.chapters
            for (i = 0; i < allChapters.length; i++) {
                if (allChapters[i]._id !== undefined) {
                    allChaptersId.push(allChapters[i]._id)
                }
            }
            chapters = await Chapter.find({_id: {$in: allChaptersId}})
            if (chapters) {

                response.status(200).send({err_code: 0, chapters})
            }

        } else {
            response.status(200).send({err_code: 0, lessons: {}, message: "This lesson does not exist"})
        }
    } catch (error) {
        response.status(statusCodes.INTERNAL_SERVER_ERROR).send({
            err_code: statusCodes.INTERNAL_SERVER_ERROR,
            message: "Could not fetch lesson",
            internalError: error
        })
    }

}
module.exports = {
    getPublicOrPrivateLesson,
    createLesson,
    updateLesson,
    searchLesson,
    getLessonById,
    getChaptesByLessonId,
    addChapterToLesson,
    deleteLessonById
} 
