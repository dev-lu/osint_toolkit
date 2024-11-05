FROM node:alpine

# Create app directory
WORKDIR /frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /frontend/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
RUN npm install
RUN npm install react-scripts

COPY . ./

# Set React compatible environment variable
ARG BACKEND_URL=http://localhost:8000
ENV REACT_APP_BACKEND_URL=${BACKEND_URL}

# Expose port 3000
EXPOSE 3000

# Run npm start, to run react app
CMD ["npm", "start"]
