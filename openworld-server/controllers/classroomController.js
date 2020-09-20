const Classroom = require("../models/classroom");

const getClassroom = function (request, response) {
    Classroom
        .find()
        .then(classrooms => classrooms.map(classroom => ({id: classroom.id, name: classroom.name})))
        .then(classrooms => response.send({classrooms}))
        .catch(error => response.sendStatus(500));
}
const createClassroom = function (request, response) {
    const {name} = request.body;
    const classroom = new Classroom({name});
    classroom
        .save()
        .then(classroom => ({id: classroom.id, name: classroom.name}))
        .then(classroom => response.send({classroom}))
        .catch(error => response.sendStatus(error ? error : 500));
}

const getClassroomById = function (request, response) {
    const {classroomId} = request.params;
    Classroom
        .findById(classroomId)
        .then(classroom => classroom ? classroom : Promise.reject({status: 404}))
        .then(classroom => ({id: classroom.id, name: classroom.name}))
        .then(classroom => response.send({classroom}))
        .catch(error => response.sendStatus(error.status ? error.status : 500));
}

const updateClassroom = function (request, response) {
    const {classroomId} = request.params;
    Classroom
        .findById(classroomId)
        .then(classroom => classroom ? classroom : Promise.reject({status: 404}))
        .then(classroom => {
            const {name} = request.body;
            if (name) {
                classroom.name = name;
            }
            return classroom;
        })
        .then(classroom => classroom.save())
        .then(classroom => ({id: classroom.id, name: classroom.name}))
        .then(classroom => response.send({classroom}))
        .catch(error => response.sendStatus(error.status ? error.status : 500));
}
const deleteClassRoom = function (request, response) {
    const {classroomId} = request.params;
    Classroom
        .findById(classroomId)
        .then(classroom => classroom ? classroom : Promise.reject({status: 404}))
        .then(classroom => classroom.remove())
        .then(classroom => ({id: classroom.id, name: classroom.name}))
        .then(classroom => response.send({classroom}))
        .catch(error => response.sendStatus(error.status ? error.status : 500));
}

module.exports = {getClassroom, getClassroomById, createClassroom, updateClassroom, deleteClassRoom}
