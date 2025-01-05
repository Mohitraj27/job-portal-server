import mongoose from 'mongoose';
const chalk = require('chalk'); 

export const connectDB = async (): Promise<void> => {
  try {
    const dbURI = process.env.DB_URI || '';
    await mongoose.connect(dbURI, {});

    
    console.log(
      chalk.greenBright.bold('MongoDB connected successfully! 🎉') +
        chalk.cyan(' Your database is now up and running! 🚀'),
    );
  } catch (error) {
    console.error(chalk.red.bold('Error connecting to MongoDB: '), error);
    process.exit(1);
  }
};
