import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Tooltip } from "@mui/material";
import { useState } from "react";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ClipboardCopy({ copyText, onClick }) {
  const [isCopied, setIsCopied] = useState(false);
  const [copyTitle, setCopyTitle] = useState('Copy');

  // This is the function we wrote earlier
  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleCopyTitle = ()=>{
    setCopyTitle('Copied');

    setTimeout(()=>{
      setCopyTitle('Copy');
    }, 2000);
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
        <InputLabel htmlFor="transaction">الرقم المميز</InputLabel>
        <OutlinedInput
          id="transaction"
          value={copyText}
          readOnly
          endAdornment={
            <InputAdornment position="end">
              <Tooltip title={copyTitle}>
                <IconButton

                  onClick={() => {
                    handleCopyClick();
                    handleCopyTitle();
                    onClick();
                  }}
                  edge="end"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>

            </InputAdornment>
          }
          label="الرقم المميز"
        />
      </FormControl>
    </div>
  );
}