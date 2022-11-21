import React from 'react';
import Button from '@mui/material/Button';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
export const ConfirmDialog = (props) => {
  const { title, children, open, setOpen, onConfirm } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog"
        sx={{ backgroundColor: 'rgb(224 242 254)' }}
      >{title}</DialogTitle>
      <DialogContent
        sx={{ backgroundColor: 'rgb(224 242 254)' }}
      >{children}</DialogContent>
      <DialogActions
        sx={{ backgroundColor: 'rgb(224 242 254)' }}
      >
        <Button
          variant="contained"
          onClick={() => setOpen(false)}
          sx={{ color: 'white', backgroundColor: '#3B82F6 !important', borderColor: 'blue' }}
        >
          No
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setOpen(false);
            onConfirm();
          }}
          sx={{ color: 'white', backgroundColor: '#3B82F6 !important', borderColor: 'blue' }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};