export class message
{
    id: number;
    content: string;
    user_id: number;
    chat_id: number;

    constructor(id: number, content: string, user_id: number, chat_id: number) {
        this.id = id;
        this.content = content;
        this.user_id = user_id;
        this.chat_id = chat_id;
    }
}