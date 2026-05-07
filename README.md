# Fliq

> A real-time collaborative photo booth experience that lets users create shared photo strips together — no matter where they are.

---

## Motivation

Fliq was created from a simple idea: we all love photo booth pictures, but those moments are usually limited to in-person experiences.

⟢ Photo booth memories are fun but inherently physical  
⟢ Existing digital tools don’t support true real-time collaboration  
⟢ It’s difficult for friends to appear together in shared creative moments while apart

Fliq bridges this gap by enabling real-time, shared photo booth sessions that let users create memories together from anywhere.

---

## Goals & Objectives

### Real-Time Collaboration

⟢ Multiple users join the same session and experience live synchronization of photos and selections

### AI Background Generation

⟢ Users generate customizable backgrounds through natural language prompts powered by generative AI

### Secure User System

⟢ Private, invitation-based sessions with authentication and protected user data

### Save & Export

⟢ Users can download, save, and revisit completed photo strips through their profile

---

## User Flow Overview

### Entry Flow

⟢ Landing page → authentication → number of users → frame layout selection

### Session Flow

⟢ Frame selection → live photo capture → preview & selection → AI background customization

### Final Stage

⟢ View final photostrip → export or save → access past strips in profile

---

## System Architecture

### Frontend

⟢ Built with SvelteKit and styled using Tailwind CSS

### Backend

⟢ Supabase handles authentication, database, and storage  
⟢ Render hosts Node.js server enabling real-time communication via Socket.IO

### APIs

⟢ Google Generative AI API powers background generation

### Deployment

⟢ Frontend deployed on Vercel  
⟢ Backend deployed on Render

### Hardware

⟢ Any device with a camera (laptop or mobile)

---

## Key Features

⟢ Real-time multi-user photo booth sessions  
⟢ AI-generated customizable backgrounds  
⟢ Shared collaborative experience across distance  
⟢ Secure authentication and private sessions  
⟢ Save, revisit, and export photo strips  
⟢ Cross-device support for desktop and mobile

---

## Future Improvements

⟢ Flexible frame customization with user-defined styles and colors  
⟢ Multi-host session control for switching roles between users  
⟢ Photo strip albums for better organization  
⟢ Animated capture playback for the photo-taking process  
⟢ Social sharing integrations

---

## Team

Designed by: [Sama Ahmed](https://github.com/26samaahmed), [Ashley Chan](https://github.com/Ashleyc417)  
Developed by: [Sama Ahmed](https://github.com/26samaahmed), [Ashley Chan](https://github.com/Ashleyc417), [Nathaniel Llora](https://github.com/Kaillora), [Kaitlyn Lee](https://github.com/kaitlynhlee)
