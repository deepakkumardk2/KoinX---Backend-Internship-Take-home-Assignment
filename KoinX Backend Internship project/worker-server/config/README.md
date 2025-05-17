# KoinX Worker Server

This worker server publishes events to the NATS queue every 15 minutes, which triggers the API server to update cryptocurrency data.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- NATS Server (local or cloud)

### Environment Variables
Create a `.env` file in the `worker-server` directory with the following variables:
