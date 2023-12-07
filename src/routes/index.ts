import express, { Router } from "express";
import controllers from "./controller";

const router: Router = express.Router();
// schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     registerBody:
 *       type: object
 *       properties:
 *         apiName:
 *           type: string
 *           description: Name of the API
 *         protocol:
 *           type: string
 *           description: Protocol (e.g., http, https)
 *         host:
 *           type: string
 *           description: Hostname of the service
 *         port:
 *           type: string
 *           description: Port number of the service
 *       required:
 *         - apiName
 *         - protocol
 *         - host
 *         - port
 *     unregisterBody:
 *          type: object
 *          properties:
 *             apiName:
 *              type: string
 *             url:
 *              type: string
 *          required:
 *           - apiName
 *           - url
 *     enableDisableBody:
 *         type: object
 *         properties:
 *          apiName:
 *            type: string
 *          enabled:
 *           type: boolean
 *          url:
 *           type: string
 */

router.get("/", controllers.main);
// "/" endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Check service status
 *     tags:
 *      - Check Status
 *     description: Check service status and return 200 if service is available
 *     responses:
 *       200:
 *         description: Service Unavailable
 */

router.post("/register", controllers.register);
// "/register" endpoint
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new service
 *     description: Register a new service with the provided information
 *     tags:
 *      - Services
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/registerBody'
 *     responses:
 *       '200':
 *         description: This url is already in use
 *       '201':
 *         description: Api created/updated successfully
 *       '400':
 *         description: An error occurred
 *       '500':
 *         description: Unexpected error
 */

router.post("/unregister", controllers.unregister);
// "/unregister" endpoint
/**
 * @swagger
 * /unregister:
 *   post:
 *     summary: Unregister a service
 *     description: Unregister a service instance with the provided information
 *     tags:
 *      - Services
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/unregisterBody'
 *     responses:
 *       '200':
 *         description: Api deleted successfully
 *       '400':
 *         description: Service not found / error occurred
 *       '500':
 *         description: Unexpected error
 */

router.post("/enable/:apiName", controllers.enable);
// "/enable/:apiName" endpoint
/**
 * @swagger
 * /enable/{apiName}:
 *   post:
 *     summary: Service Enable/Disable with apiName
 *     description: Enable/Disable service with apiName
 *     tags:
 *      - Services
 *     parameters:
 *       - in: path
 *         name: apiName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the Service Name to enable/disable
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *              schema:
 *                $ref: '#/components/schemas/enableDisableBody'
 *     responses:
 *       '200':
 *         description: Service updated successfully
 *       '400':
 *         description: Service not found / error occurred
 *       '500':
 *         description: Unexpected error
 */

router.all("/:apiName/:path", controllers.redirect);
// "/:apiName/:path" endpoint

/**
 * @swagger
 * /{apiName}/{path}:
 *   get:
 *     summary: Redirect to service for GET request
 *     description: Redirect to service for GET request
 *     tags:
 *       - Redirect To Service
 *     parameters:
 *       - in: path
 *         name: apiName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the service representing the API
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Endpoint path for redirection within the specified API
 *     responses:
 *       '200':
 *         description: Successful redirection with the response from the service
 *       '500':
 *         description: Internal server error
 *       '400':
 *         description: Bad request, an error occurred
 *   post:
 *     summary: Redirect to service for POST request
 *     description: Redirect to service for POST request
 *     tags:
 *       - Redirect To Service
 *     parameters:
 *       - in: path
 *         name: apiName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the service representing the API
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Endpoint path for redirection within the specified API
 *     responses:
 *       '201':
 *         description: Service created/updated successfully
 *       '500':
 *         description: Internal server error
 *       '400':
 *         description: Bad request, an error occurred
 *   put:
 *     summary: Redirect to service for PUT request
 *     description: Redirect to service for PUT request
 *     tags:
 *       - Redirect To Service
 *     parameters:
 *       - in: path
 *         name: apiName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the service representing the API
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Endpoint path for redirection within the specified API
 *     responses:
 *       '200':
 *         description: Successful redirection with the response from the service
 *       '500':
 *         description: Internal server error
 *       '400':
 *         description: Bad request, an error occurred
 *   delete:
 *     summary: Redirect to service for DELETE request
 *     description: Redirect to service for DELETE request
 *     tags:
 *       - Redirect To Service
 *     parameters:
 *       - in: path
 *         name: apiName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the service representing the API
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Endpoint path for redirection within the specified API
 *     responses:
 *       '200':
 *         description: Successful redirection with the response from the service
 *       '500':
 *         description: Internal server error
 *       '400':
 *         description: Bad request, an error occurred
 *   patch:
 *     summary: Redirect to service for PATCH request
 *     description: Redirect to service for PATCH request
 *     tags:
 *       - Redirect To Service
 *     parameters:
 *       - in: path
 *         name: apiName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the service representing the API
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Endpoint path for redirection within the specified API
 *     responses:
 *       '200':
 *         description: Successful redirection with the response from the service
 *       '500':
 *         description: Internal server error
 *       '400':
 *         description: Bad request, an error occurred
 */

export default router;
