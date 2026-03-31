📌 Pull Request / Release Description
File Upload Functionality Complete! 🎉
This PR adds comprehensive file attachment support to the task management app.

Backend

Updated TasksController store() & update() to handle file uploads

Added validation (max 10MB, allowed types: images, PDF, DOC, DOCX, TXT)

Files stored in storage/app/public/task-files/ with unique naming

New database fields: file_path, file_name, file_type

Frontend

File input with drag-and-drop styling in create/edit forms

Edit mode allows replacing existing attachments

File display with download links, image thumbnails, and file icons

Old files automatically removed when replaced

How to use

Create task – attach a file via the file input

Edit task – replace the attachment using the same input

View files – click download links or see image previews below task description
