import mongoose from "mongoose";    
export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ankitbrijeshmishra10_db_user:MishraQuiz-App@cluster0.9pjisye.mongodb.net/Quiz-App')
    .then(()=> console.log('MongoDB connected successfully'))
}
