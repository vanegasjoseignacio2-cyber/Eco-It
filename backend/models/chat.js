import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: { 
        type: String, 
        enum: ["user", "bot", "system"], 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    imagen: { 
        type: String,
        default: null
    },
    fecha: { 
        type: Date, 
        default: Date.now 
    }
});

const chatSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    title: { 
        type: String, 
        default: "Nueva conversación" 
    },
    mensajes: [messageSchema]
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);
