import mongoose from 'mongoose';

const carouselSchema = new mongoose.Schema({
    tag: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    src: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    width: {
        type: Number,
        default: null
    },
    height: {
        type: Number,
        default: null
    }
}, {
    timestamps: true
});

const CarouselSlide = mongoose.model('CarouselSlide', carouselSchema);

export default CarouselSlide;