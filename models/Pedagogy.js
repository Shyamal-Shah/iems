const mongoose = require("mongoose");
const PedagogySchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects",
      required: true,
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'academicYear',
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    components: [
      {
        name: {
          type: String,
          required: true,
        },
        mode: {
          type: String,
          required: true,
        },
        weightAge: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = Pedagody = mongoose.model("pedagogies", PedagogySchema);
