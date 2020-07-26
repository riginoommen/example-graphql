import { UserModel, ProjectModel } from './schema';

export const UsecaseModelResolver = {
  Query: {
    getUser(parent:any, args:any, ctx:any, info:any) {
      return UserModel.findOne({ uid: args.uid })
        .then(data => data)
        .catch(err => err);
    },
    listUsers() {
      return UserModel.find()
        .then(data => data)
        .catch(err => err);
    },

    getProject(root: any, args: any, ctx: any) {
      return ProjectModel.findOne({ assigneeID: args.assigneeID })
        .then(data => data)
        .catch(err => err);
    },
    listProjects() {
      return ProjectModel.find()
        .then(data => data)
        .catch(err => err);
    },
  },
  User:{
    projects(parent:any, root: any, args: any, ctx: any){
      return ProjectModel.find({ assigneeID: parent.uid })
        .then(data => data)
        .catch(err => err);
    }
  },
  Mutation: {
    addUser(root: any, args: any, ctx: any) {
      const data = new UserModel(args.input);
      return data.save()
        .then(response => response)
        .catch(err => err);
    },
    deleteUser(root: any, args: any, ctx: any) {
      return UserModel.findByIdAndRemove(args._id)
        .then(response => response)
        .catch(err => err);
    },
    updateUser(root: any, args: any, ctx: any) {
      return UserModel.findById(args.input._id)
        .then(response => {
          return Object.assign(response, args.input)
            .save()
            .then((user: any) => {
              return user;
            });
        })
        .catch((err: any) => err);
    },
    addProject(root: any, args: any, ctx: any) {
      const data = new ProjectModel(args.input);
      return data.save()
        .then(response => response)
        .catch(err => err);
    },
    deleteProject(root: any, args: any, ctx: any) {
      return ProjectModel.findByIdAndRemove(args._id)
        .then(response => response)
        .catch(err => err);
    },
    updateProject(root: any, args: any, ctx: any) {
      return ProjectModel.findById(args.input._id)
        .then(response => {
          return Object.assign(response, args.input)
            .save()
            .then((user: any) => {
              return user;
            });
        })
        .catch((err: any) => err);
    }
  }
}


