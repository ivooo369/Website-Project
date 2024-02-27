import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function ContactForm() {
  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { my: 1, mx: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      <div className="contact-form">
        <h2>Форма за контакти</h2>
        <div className="inputs-container">
          <div className="name-and-email-inputs">
            <TextField fullWidth required id="name-input" label="Имена" />
            <TextField fullWidth required id="email-input" label="E-mail" />
          </div>
          <TextField fullWidth required id="topic-input" label="Тема" />
          <TextField
            required
            id="message-input"
            label="Съобщение"
            multiline
            rows={3}
            sx={{ width: "100%" }}
          />
        </div>
        <button className="submit-button" role="button">
          Submit
        </button>
      </div>
    </Box>
  );
}
