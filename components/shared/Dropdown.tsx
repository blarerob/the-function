import * as React from 'react';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import {startTransition, useState} from 'react';
import {ICategory} from "@/lib/mongodb/database/models/category.model";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import {InputLabel} from "@mui/material";

type DropdownProps = {
    value?: string;
    onChangeHandler?: () => void;
};

const Dropdown = ({value, onChangeHandler}: DropdownProps) => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [open, setOpen] = React.useState(false);

    const handleAddCategory = () => {

    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <FormControl sx={{mt: 2, minWidth: 120}}>
            <InputLabel component="div">Category</InputLabel>
            <Select
                label='Category'
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
            >
                {categories.length > 0 && categories.map((category) => (
                    <MenuItem key={category._id} value={category._id} className='select-item p-regular-14'>
                        {category.name}
                    </MenuItem>
                ))}
                <div className='p-medium-14 flex w-full rounded-sm py-3 pl-8 text-black hover:bg-red-100 focus:text-red-900'>
                    <button onClick={handleClickOpen}>
                        Add Category
                    </button>
                </div>
                <Dialog
                    className='bg-white'
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"New Category"}
                    </DialogTitle>
                    <DialogContent>
                        <TextField type='text' placeholder='Category name' className='input-field mt-3'
                                   onChange={(e) =>
                                       setNewCategory(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => startTransition
                        (handleAddCategory)}>
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </Select>
        </FormControl>
    );
};

export default Dropdown;