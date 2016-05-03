# Redux boilerplate

#### As simple as can be universal redux boilerplate project. Inspired by the simplicity of [Redux examples](http://redux.js.org/docs/introduction/Examples.html) and server organization of [Angular Fullstack Generator](https://github.com/angular-fullstack/generator-angular-fullstack) 

#####Features:
- Universal Auth
  - Facebook
  - Twitter
  - Local
- Router (react-router-redux TODO replace with just react router?)
- MongoDB + api <- not universal (TODO)
- Socket.io <- needs some more work (TODO)

#####Todos:
- Test setup (integration almost done)
- Cleanup Socket.io
- Universal api middleware

to run app:  
```
npm install
```
then  
```
npm start
```

weback is integrated into the extress server and will do automatic watch and reload

to build for pruduction (for example before pushing to heroku)
```
npm run build
```
