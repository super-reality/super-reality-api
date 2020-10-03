require("dotenv").config();

const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')
const Collection = require('../../models/collection')


const userCorrectOneId = new mongoose.Types.ObjectId()

const userCorrectOne = {
    _id: userCorrectOneId,
    username: 'fartpants',
    firstname: 'Fart',
    lastname: 'Pants',
    email: 'fart@pants.com',
    password: 'password',
    tokens: [{
        token: jwt.sign({ _id: userCorrectOneId }, process.env.JWT_SECRET)
    }]
}




const userCorrectTwoId = new mongoose.Types.ObjectId()
const userCorrectTwo = {
    // _id: userCorrectTwoId,
    username: 'MX222',
    firstname: 'Mike 2',
    lastname: 'Andrew2',
    email: 'mike@example2.com',
    password: '56what!!2',
    tokens: [{
        token: jwt.sign({ _id: userCorrectTwoId }, process.env.JWT_SECRET)
    }]
}


const userCorrectThreeId = new mongoose.Types.ObjectId()
const userCorrectThree = {
    // _id: userCorrectThreeId,
    username: 'MX222',
    firstname: 'Mike 3',
    lastname: 'Andrew2',
    email: 'mike@example2.com',
    password: '56what!!2',
    tokens: [{
        token: jwt.sign({ _id: userCorrectThreeId }, process.env.JWT_SECRET)
    }]
}

const userIncorrectOneId = new mongoose.Types.ObjectId()
const userIncorrectOne = {
    // _id: userOneId,
    username: 'MX222',
    firstname: 'Mike 4',
    lastname: 'Andrew2',
    email: 'mike@example2.com',
    password: '56what!!2',
    tokens: [{
        token: jwt.sign({ _id: userIncorrectOneId }, process.env.JWT_SECRET)
    }]
}

const userIncorrectTwoId = new mongoose.Types.ObjectId()
const userIncorrectTwo = {
    // _id: userIncorrectTwoId,
    username: 'MX222',
    firstname: 'Mike 5',
    lastname: 'Andrew2',
    email: 'mike@example2.com',
    password: '56what!!2',
    tokens: [{
        token: jwt.sign({ _id: userIncorrectTwoId }, process.env.JWT_SECRET)
    }]
}

const userIncorrectThreeId = new mongoose.Types.ObjectId()
const userIncorrectThree = {
    // _id: userIncorrectThreeId,
    username: 'MX222',
    firstname: 'Mike 6',
    lastname: 'Andrew2',
    email: 'mike@example2.com',
    password: '56what!!2',
    tokens: [{
        token: jwt.sign({ _id: userIncorrectThreeId }, process.env.JWT_SECRET)
    }]
}

var dateRightOne = new Date(2020, 5, 24, 18, 30);
var dateWrongOne = new Date(1987, 5, 24, 18, 30);


const collectionUpdatedSchema = {

    tags: [
        "nodejs", "node", "javascript", "css", "html", "js"
    ],
    media: {
        "mediaID": "kdjfkjekjeklj",
        "url": "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1599086161983.png",
        "fileType": "png",
        "uploadedBy": "kajdkjfkalsjdf",
        "uploadedData": dateRightOne,
        "approved": true,

    },
    children: [
        {
            "childType": "lesson",
            "childTitle": "Ultrices pharetra faucibus eu",
            "childDescription": "Sed dolor lectus, ultrices pharetra faucibus eu, laoreet non ipsum. Quisque egestas ante at erat hendrerit tempor. Donec laoreet odio ligula, vitae eleifend odio viverra et.",
            "childImage": "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1599086161983.png",
            "childId": "kdjflkjsddd443fsdf"
        },
        {
            "childType": "step",
            "childTitle": "Starting a fire with no matches",
            "childDescription": "Sed dolor lectus, ultrices pharetra faucibus eu, laoreet non ipsum. Quisque egestas ante at erat hendrerit tempor. Donec laoreet odio ligula, vitae eleifend odio viverra et.",
            "childImage": "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1599086161983.png",
            "childId": "kdjflkjsdfsdf"
        },
    ],
    visibility: true,
    createdDate: dateWrongOne,
    smallImage: "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1599086161983.png",
    largeImage: "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1599086161983.png",
    shortDescription: "Nam odio ante, fringilla vitae sapien et, finibus blandit mi. Suspendisse congue non dui ut maximus. Ut nec velit pharetra, finibus lacus et, viverra orci. Donec facilisis accumsan purus ultricies dictum",
    longDescription: "Nam odio ante, fringilla vitae sapien et, finibus blandit mi. Suspendisse congue non dui ut maximus. Ut nec velit pharetra, finibus lacus et, viverra orci. Donec facilisis accumsan purus ultricies dictum",
    numberOfShares: 343,
    numbersOfActivations: 333,
    createdBy: "kdkjf8d78d7f6dfj",
    approved: true,

}



const collectionCorrectTwo = {
    icon: "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1599086161983.png",
    name: "How to brush your teeth 2",
    shortDescription: "First get a pack of matches",
    description: "Buy a toothbrush",
    tags: ["nodejs", "javascript", "php", "fire making"],
    medias: ["media1", "media2", "media3"],
    visibility: [
        "this is the visibility array"
    ],
    entry: 45,
    numberOfShares: 425,
    numberOfActivations: 456,
    numberOfSubjects: 12,
    numberOfLessons: 13,
    avgUserEngage: "not sure what this means",
    options: ["type 1", "option2", "option 4"],
    isRemixed: true,
    remixedFrom: "some other thing",
    createdBy: userCorrectOneId,
    createdAt: dateRightOne
}
const collectionCorrectThree = {
    icon: "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1599086161983.png",
    name: "How to brush your teeth 3",
    shortDescription: "First get a pack of matches",
    description: "Buy a toothbrush",
    tags: ["nodejs", "javascript", "php", "fire making"],
    medias: ["media1", "media2", "media3"],
    visibility: [
        "this is the visibility array"
    ],
    entry: 45,
    numberOfShares: 425,
    numberOfActivations: 456,
    numberOfSubjects: 12,
    numberOfLessons: 13,
    avgUserEngage: "not sure what this means",
    options: ["type 1", "option2", "option 4"],
    isRemixed: true,
    remixedFrom: "some other thing",
    createdBy: userCorrectOneId,
    createdAt: dateRightOne
}

const collectionIncorrectOne = {
    icon: "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1599086161983.png",
    name: "How to brush your teeth 4",
    shortDescription: "First get a pack of matches",
    description: "Buy a toothbrush",
    tags: ["nodejs", "javascript", "php", "fire making"],
    medias: ["media1", "media2", "media3"],
    visibility: [
        "this is the visibility array"
    ],
    entry: 45,
    numberOfShares: 425,
    numberOfActivations: 456,
    numberOfSubjects: 12,
    numberOfLessons: 13,
    avgUserEngage: "not sure what this means",
    options: ["type 1", "option2", "option 4"],
    isRemixed: true,
    remixedFrom: "some other thing",
    createdBy: userCorrectOneId,
    createdAt: dateRightOne
}

const collectionIncorrectTwo = {
    icon: "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1599086161983.png",
    name: "How to brush your teeth 5",
    shortDescription: "First get a pack of matches",
    description: "Buy a toothbrush",
    tags: ["nodejs", "javascript", "php", "fire making"],
    medias: ["media1", "media2", "media3"],
    visibility: [
        "this is the visibility array"
    ],
    entry: 45,
    numberOfShares: 425,
    numberOfActivations: 456,
    numberOfSubjects: 12,
    numberOfLessons: 13,
    avgUserEngage: "not sure what this means",
    options: ["type 1", "option2", "option 4"],
    isRemixed: true,
    remixedFrom: "some other thing",
    createdBy: userCorrectOneId,
    createdAt: dateRightOne
}

const collectionIncorrectThree = {
    icon: "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1599086161983.png",
    name: "How to brush your teeth 6",
    shortDescription: "First get a pack of matches",
    description: "Buy a toothbrush",
    tags: ["nodejs", "javascript", "php", "fire making"],
    medias: ["media1", "media2", "media3"],
    visibility: [
        "this is the visibility array"
    ],
    entry: 45,
    numberOfShares: 425,
    numberOfActivations: 456,
    numberOfSubjects: 12,
    numberOfLessons: 13,
    avgUserEngage: "not sure what this means",
    options: ["type 1", "option2", "option 4"],
    isRemixed: true,
    remixedFrom: "some other thing",
    createdBy: userCorrectOneId,
    createdAt: dateRightOne
}

const collectionCorrectOne = {
    icon: "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1599086161983.png",
    name: "How to brush your teeth 1",
    shortDescription: "First get a pack of matches",
    description: "Buy a toothbrush",
    tags: ["nodejs", "javascript", "php", "fire making"],
    medias: ["media1", "media2", "media3"],
    visibility: [
        "this is the visibility array"
    ],
    entry: 45,
    numberOfShares: 425,
    numberOfActivations: 456,
    numberOfSubjects: 12,
    numberOfLessons: 13,
    avgUserEngage: "not sure what this means",
    options: ["type 1", "option2", "option 4"],
    isRemixed: true,
    remixedFrom: "some other thing",
    createdBy: userCorrectOneId,
    createdAt: dateRightOne
}

const setupDatabase = async () => {
    console.log('SETUP DATATBASE')
    //Delete all data in - -test

    await User.deleteMany()
    await Collection.deleteMany()

    // //Create Users

    const user1 = await new User(userCorrectOne)
    user1.setPassword(userCorrectOne.password)
    user1.save();

    const user2 = await new User(userCorrectTwo)
    user2.setPassword(userCorrectTwo.password)
    user2.save();

    const user3 = await new User(userCorrectThree)
    user3.setPassword(userCorrectTwo.password)
    user3.save();

    const user4 = await new User(userIncorrectOne)
    user4.setPassword(userIncorrectOne.password)
    user4.save();

    const user5 = await new User(userIncorrectTwo)
    user5.setPassword(userIncorrectTwo.password)
    user5.save();

    const user6 = await new User(userIncorrectThree)
    user6.setPassword(userIncorrectThree.password)
    user6.save();


    // //Create Collections
    await new Collection(collectionCorrectOne).save()
    await new Collection(collectionCorrectTwo).save()
    await new Collection(collectionCorrectThree).save()
    await new Collection(collectionIncorrectOne).save()
    await new Collection(collectionIncorrectTwo).save()
    await new Collection(collectionIncorrectThree).save()
}



module.exports = {
    setupDatabase,
    userCorrectOne,
    userCorrectTwo,
    userCorrectThree,
    userIncorrectOne,
    userIncorrectTwo,
    userIncorrectThree,
    collectionCorrectOne,
    collectionCorrectTwo,
    collectionCorrectThree,
    collectionIncorrectOne,
    collectionIncorrectTwo,
    collectionIncorrectThree


}

    // try {
    //     const matt = await new User(userOne).save()

    // } catch (e) {
    // }

