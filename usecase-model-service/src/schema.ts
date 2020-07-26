import { Document, Model, model, Schema } from 'mongoose';


// User Schema
export const UserSchema: Schema = new Schema({
    uid: String,
    name: String,
    email: String
});

interface UserModel extends UserType , Document { }

interface UserModelStatic extends Model <UserModel> { }

export const UserModel: Model<UserModel> = model<UserModel, UserModelStatic>('UserModel', UserSchema);



// Project Schema
export const ProjectSchema: Schema = new Schema({
    assigneeID: String,
    title: String,
    description: String
});

interface ProjectModel extends ProjectType , Document { }

interface ProjectModelStatic extends Model <ProjectModel> { }

export const ProjectModel: Model<ProjectModel> = model<ProjectModel, ProjectModelStatic>('ProjectModel', ProjectSchema);
