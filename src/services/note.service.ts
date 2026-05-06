import { NoteRepository } from "../repositories/note.repository";

const noteRepository = new NoteRepository();

export class NoteService {
  async createNote(userId: string, title: string, content: string) {
    return noteRepository.create({
      userId,
      title,
      content,
    });
  }

  async getNotes(userId: string) {
    return noteRepository.findAllByUserId(userId);
  }

  async getNoteById(id: string, userId: string) {
    const note = await noteRepository.findByIdAndUserId(id, userId);
    if (!note) {
      throw new Error("Note not found or unauthorized");
    }
    return note;
  }

  async updateNote(id: string, userId: string, title?: string, content?: string) {
    await this.getNoteById(id, userId); // check existence
    return noteRepository.update(id, userId, {
      ...(title && { title }),
      ...(content && { content }),
    });
  }

  async deleteNote(id: string, userId: string) {
    await this.getNoteById(id, userId); // check existence
    return noteRepository.delete(id, userId);
  }
}
