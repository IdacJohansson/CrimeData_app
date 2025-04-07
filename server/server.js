import express from 'express';
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

const app = express();
const router = express.Router();
app.use(express.json());

const PORT = 8080; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});