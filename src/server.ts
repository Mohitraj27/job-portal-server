import app from './app';
import 'module-alias/register';
import '@config/auth/passport';
import { connectDB } from '@config/database';
import { config } from '@config/env';

app.listen(config.port, async () => {
  try {
    await connectDB();
    console.log(`Server running on http://localhost:${config.port}`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
});
