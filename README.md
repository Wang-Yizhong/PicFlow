# PicFlow

PicFlow is a mobile gallery app built with **React Native (Expo)**.  
It displays photos from the [Picsum API](https://picsum.photos/v2/list) with pagination and allows users to view details or download images locally.  
The UI is styled using **Tailwind (twrnc)** for a clean, responsive design.

## Features
- Fetch and display photos with pagination (10 per page)
- View image details in a modal (height, width, grayscale preview, download URL)
- Hide images from the list
- Download and save images to the device gallery
- Tailwind-based styling with `twrnc`

## Tech Stack
- React Native / Expo 54 / TypeScript  
- twrnc (Tailwind for React Native)  
- Expo Image, LinearGradient, FileSystem, MediaLibrary

## Getting Started
```bash
git clone https://github.com/your-username/picflow.git
cd picflow
npm install
npx expo start
