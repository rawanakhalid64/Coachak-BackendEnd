# # development stage

# FROM node:23-alpine AS dev

# # define working directory in container
# WORKDIR /app

# #copy package json and package-lock json to container
# COPY backend/package*.json ./
# RUN npm install && npm cache clean --force  

# # copy all files to container
# COPY backend/ .

# CMD ["npx" ,"nodemon","index.js"]

# # production stage
# FROM node:23-alpine AS pro

# # define working directory in container
# WORKDIR /app

# #copy package json and package-lock json to container
# COPY backend/package*.json ./
# RUN npm install

# # copy all files to container
# COPY backend/ .

# #start the app in production
# CMD [ "node" , "index.js" ]

# Development Stage
FROM node:23-slim AS dev
WORKDIR /app
# Copy package.json and package-lock.json from the root
COPY package*.json ./  
RUN npm set registry https://registry.npmjs.org/ && npm install --only=development && npm cache clean --force
 # Copy all files from the root to /app
COPY . . 
CMD ["npx", "nodemon", "index.js"]

# Production Stage
FROM node:23-slim AS pro
WORKDIR /app
# Copy package.json and package-lock.json from the root
COPY package*.json ./  
RUN npm install --only=production && npm cache clean --force
# Copy all files from the root to /app
COPY . .  
CMD ["node", "index.js"]