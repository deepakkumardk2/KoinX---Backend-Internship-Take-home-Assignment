# KoinX Backend Internship Project

This project consists of two Node.js servers (API server and Worker server) that communicate via NATS to collect and expose cryptocurrency statistics.

## Project Structure

- `/api-server`: Handles API requests and data storage
- `/worker-server`: Schedules updates via NATS event queue

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- NATS Server (local or cloud)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd koinx-backend-task