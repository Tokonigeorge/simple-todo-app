## React Tutorial – The Beginners Guide to Learning React JS in 2020

[To follow this React tutorial](https://ibaslogic.com/blog/react-tutorial-for-beginners/)

### Clone the starter project

You can download or clone this project by running this command from your terminal:

```
git clone https://github.com/Ibaslogic/simple-todo-app
```

This will create a directory in the name of the project folder.

Once you have the project files and folders bootstrapped, open it with your text editor.

Next, switch inside the project directory and run:

```
npm install
```

This will install all the necessary dependencies in the local `node_modules` folder.

### Setting up the Testing Environment

To run tests, ensure you have the following packages installed:

- **Jest**: A delightful JavaScript Testing Framework with a focus on simplicity.
- **@testing-library/react**: Simple and complete React DOM testing utilities that encourage good testing practices.
- **redux-mock-store**: A mock store for testing Redux async action creators and middleware.
- **babel-jest**: Jest plugin to use Babel for transformation.

You can install these testing dependencies by running:

```
npm install --save-dev jest @testing-library/react redux-mock-store babel-jest
```

### Running the Development Server

Finally, start your development server by running:

```
npm start
```

You should see the app in your browser address bar at [http://localhost:5173](http://localhost:5173) by default, unless you have configured a different port.

### Running Tests

To run the tests, use the following command:

```
npm test
```

This will execute all the test files in the project using Jest.
