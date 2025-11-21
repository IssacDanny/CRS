# Dockerfile

# 1. Use an official Node.js runtime as the base image (alpine is lightweight)
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json to the working directory
# This is done separately to leverage Docker's layer caching
COPY package*.json ./

# 4. Install project dependencies
RUN npm install

# 5. Copy the rest of your application's source code
COPY . .

# 6. Expose the port that the application will run on
EXPOSE 3000

# 7. Define the command to run the application
CMD [ "npm", "run", "start" ]