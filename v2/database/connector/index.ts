import mongoose from 'mongoose';

mongoose.connect(process.env.DATABASE_URL || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

export default mongoose;
