

    export default class Todo {
    constructor({id, title, description, completed, created_at, updated_at,due_date, groupName}) {
        this.id = id;
        this.title = title;
        this.description = description || null;
        this.completed = completed;
        this.created_at = new Date(created_at);
        this.updated_at = new Date(updated_at);
        this.due_date = due_date ? new Date(due_date) : new Date();
        this.groupName = groupName || null;
    }
    }