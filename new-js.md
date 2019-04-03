# Tips new JavaScript
The modern ES6/ES7/ES8 JavaScript offers us many amazing features out of the box.

---
## let vs var
var is function scoped and let is block scoped.
```javascript
function f1() {
    // y is visible here (undefined)
    if (  ) {
        // y is visible here
        var y = 0;
     }
    // y is visible here (0)
}
function f2() {
    // x is not visible here (Error)
    if (  ) {  
        let x = 0;  // x is only visible here
     }
    // x is not visible here (Error)
}

```
---

## Arrow function
### Arrow function syntax
```javascript
(argument1, argument2, ... argumentN) => {
  // function body
};


const multiply = (x, y) => { return x * y };
const add = (a, b) => a + b;

const getFirst = array => array[0];
```
---
### Arrow function context
Context is the value of this.

Unlike every other form of functions, arrow functions do not have their own execution context. Practically, this means that this is inherited from their parent function.

No bind, no apply, no call.

---
### When to use arrow functions 
#### Functions applied to items in a list
* Make all the element lower case:
```javascript
const words = ['hello', 'WORLD', 'Whatever'];
const downcasedWords = words.map(word => word.toLowerCase());
```
* Get a value of an object:
```javascript
const names = objects.map(object => object.name);
```
---
* with forEach with this from the parent:

```javascript
this.examples.forEach(example => {
  this.runExample(example);
});

```
---
### Promises
Promises are good for managing async code. Using promises requires defining functions that run after your asynchronous code completes. 

Using arrow functions is good, especially if your resulting function is referencing something in your object.

```javascript
this.doSomethingAsync().then((result) => {
  this.storeResult(result);
});

```
---
### When not to use arrow functions
#### Events handlers
```javascript
const button = document.querySelector('#pushy');
button.addEventListener('click', () => {
    console.log(this); // Window!
    this.classList.toggle('on');  // Error
});

const button = document.querySelector('#pushy');
button.addEventListener('click', function() {
    console.log(this); // Button
    this.classList.toggle('on');
});
```
---
#### Object methods
```javascript
const person1 = {
    points: 23,
    printPoints: () => {
    	console.log(this.points); 
    }
}

person1.printPoints(); // undefined 
```
Because it’s trying to read points from the window!  In arrow function, this is not bound to anything and it inherits it from the parent scope which in this case is the window.

```javascript
const person2 = {
    points: 23,
    printPoints: function() {
    	console.log(this.points);
    }
}
person2.printPoints(); // 23
```
---
#### Class methods
```javascript
class Person1 {
  points = 0;

  printPoints = () => {
    console.log(this.points); // undefined
  }
}

let person1 = new Person1();

person1.printPoints(); // undefined 


class Person2 {
  points = 0;

 function printPoints() {
    console.log(this.points);
  }
}

let person2 = new Person2();

person2.printPoints(); // 0
```
---
### Arrow functions
Arrow functions are awesome, but not a foolproof solution to the JavaScript scope problem. Use them when it makes sense. 

* When to use arrow functions:
  + Functions applied to items in a list
  + Promises
* When to use normal functions:
  + Events handlers
  + Object methods
  + Class methods

---
## eval is evil
You should never use eval.
* performance issues (recompiling the code).
* security issues.
---

## Asynchronous JavaScript
---
### Callback hell
```javascript
const verifyUser = (username, password, callback) => {
  dataBase.verifyUser(username, password, (error, userInfo) => {
    if (error) {
      callback(error)
    } else {
      dataBase.getRoles(username, (error, roles) => {
        if (error) {
          callback(error)
        } else {
          dataBase.logAccess(username, (error) => {
            if (error) {
              callback(error);
            } else { 
              callback(null, userInfo, roles);
            }
          })
        }
      })
    }
  })
}
```
---
```javascript
const getRoles = (username, callback) => {
  database.connect((connection) => {
    connection.query('get roles sql', (result) => {
      callback(null, result);
    })
  });
}
```
---
### JavaScript Promises
The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
```javascript
var promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 300);
});
```
---
##### Example
```javascript
const verifyUser = (username, password) => {
  database.verifyUser(username, password)
    .then(userInfo => dataBase.getRoles(userInfo))
    .then(rolesInfo => dataBase.logAccess(rolesInfo))
    .then(finalResult => {
      // success handler
    })
    .catch((err) => {
      // error handler for promise chain
    });
}

```
---

### Async/await
#### Async functions
Async means a function always returns a promise:
```javascript
const f = async () => {
  return 1;
}
f(); //[object Promise]
f().then(alert); // 1
```



```javascript
const f = async () => {
  return Promise.resolve(1);
}


f().then(alert); // 1
```
---
#### Await
- The keyword await makes JavaScript wait until that promise settles and returns its result.
- It works only inside async functions.

```javascript
let value = await promise;
```
---
##### Example

```javascript
const f = async () => {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve('done', 1000)
  });

  let result = await promise; // wait until the promise resolves
  alert(result); // done!
}
f();

```
---
#### Error handling

In case of error:

```javascript

const f = async () => {
  await Promise.reject(new Error('Whoops!'));
}
f(); // Uncaught (in promise) Error: Whoops!


```
---


```javascript

const f = async () => {
  let response = await fetch('http://no-such-url');
}

f().catch(alert);

```


```javascript
const f = async () => {

  try {
    let response = await fetch('/no-user-here');
    let user = await response.json();
  } catch(err) {
    // catches errors both in fetch and response.json
    alert(err);
  }
}

f();

```

---

#### Example
```javascript
const verifyUser = async (username, password) => {
  try {
    const userInfo = await dataBase.verifyUser(username, password);
    const rolesInfo = await dataBase.getRoles(userInfo);
    const logStatus = await dataBase.logAccess(userInfo);
    return userInfo;
  } catch (e) {
    console.log(e);
   }
}
```
---
## Prototypes
### Prototypes
+ Every JavaScript object has a prototype.
+ If you try to call a method or get a property from an object, and it doesn't exist in the object, JavaScript will traverse the prototype chain until it finds it. Otherwise, it is undefined.

```javascript

let parent = {
  fn: function() {
    return this.val;
  },
  val : 0
} 

var child = Object.create(parent); // set child protype to parent
child.get(); // 0
child.val =  1;
child.a; // undefined

var grandchild = Object.create(child); // set grandchild protype to child
grandchild.get(); // 1



```
---


## Prototypes
### Functions

Whenever you create a function, you create two objects:
+ the function object (has the properties: name, length and prototype)
+ the function prototype object which has the constructor property


---



## Classes
### Using Prototype
```javascript

function Parent(val) {
  this.val = val;  
}

Parent.porototype.get = function() {
  return val;
}

let child = new Parent(1);
child.get(); // 1



```
---

## Classes
### Using Class

Syntax sugar for the prototype version.

```javascript

class Parent {
 constructor(val) {
    this.val = val;  
  }
  get() {
    return this.val;
  } 
}

let child = new Parent(1);
child.get(); // 1


```
----

## Inheritance
### Using Prototype

```javascript

function GrandParent(name) {
  this.name = name;  
}

GrandParent.porototype.getName = function() {
  return val;
}


function Parent(val, name) {
  this.val = val;
  GrandPrent.call(this, name);
}

Parent.porototype = new GrandParent();

Parent.porototype.get = function() {
  return val;
}


let child = new Child(12, "r");

child.getName(); // r
child.get(); // 12


```
---
## Inheritance
### Using Class

Syntax sugar for the prototype version.

```javascript

class GrandParent {
  constructor(name) {
    this.name = name;  
  }
  getName() {
    return this.name;
  }
}


class Parent extends GrandParent {
  constructor(val, name) {
    this.val = val;
    super(name);
  }
  get() {
    return this.val;
  } 
}

let child = new Child(12, "r");

child.getName(); // r
child.get(); // 12


```
----

#### Summary
* Always use let.
* Use arrow function whenever it makes sense.
* Never use eval.
* Always use async and await for making async calls.
* Use classes and think in prototypes.

---
## Questions?

