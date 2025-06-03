import * as React from 'react';
import { Button } from "@/components/ui/button";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ICategory } from "@/lib/database/models/category.model";
import { useState, useEffect, startTransition } from "react";
import { createCategory, getAllCategories } from "@/lib/actions/category.actions";
import { TextField } from "@mui/material";
import {styled} from "@mui/material/styles";

type DropdownProps = {
    value?: string;
    onChangeHandler?: (value: string | undefined) => void;
};

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: (theme || theme).palette.background.paper,
}));

const Dropdown = ({ value, onChangeHandler }: DropdownProps) => {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
    const [selectedName, setSelectedName] = useState<string | undefined>();

    useEffect(() => {
        const fetchCategories = async () => {
            const categoryList = await getAllCategories();
            if (categoryList) setCategories(categoryList as ICategory[]);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (value) {
            const selectedCategory = categories.find(category => category._id === value);
            setSelectedName(selectedCategory ? selectedCategory.name : undefined);
        }
    }, [value, categories]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (id: string | undefined) => {
        setOpen(false);
        setSelectedValue(id);
        const selectedCategory = categories.find(category => category._id === id);
        setSelectedName(selectedCategory ? selectedCategory.name : undefined);
        if (onChangeHandler) onChangeHandler(id);
    };

    const handleAddCategory = async () => {
        if (newCategory.trim() !== '') {
            const category = await createCategory({ categoryName: newCategory.trim() });
            setCategories((prevState) => [...prevState, category]);
            setNewCategory('');
        }
    };

    return (
        <div>
            <div className="flex flex-col gap-5 md:flex-row">
             <Button
                  onClick={handleClickOpen}
                  className="input-field bg-white border-2 border-gray-300 focus:ring-gray-300 rounded-lg flex items-center justify-between hover:border-blue-500 hover:bg-white"
              >
                  <span className='text-gray-400 font-light'>{selectedName ? selectedName : 'Select Category'}</span>
                  <svg
                      className="ml-2 w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                  >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
              </Button>
            </div>

            <Dialog  defaultValue={value} onClose={() => handleClose(selectedValue)} open={open}>
                <Demo>
                <List sx={{ pt: 0 }}>
                    {categories.map((category) => (
                        <ListItemButton key={category._id} onClick={() => handleClose(category._id)}>
                            <ListItemText primary={category.name} />
                        </ListItemButton>
                    ))}
                   <ListItem className="flex items-start">
                       <AddCircleOutlineIcon fontSize="medium" className="mr-2" />
                       <TextField
                           placeholder="Add category"
                           value={newCategory}
                           onChange={(e) => setNewCategory(e.target.value)}
                           onKeyPress={(e) => {
                               if (e.key === 'Enter') {
                                   startTransition(handleAddCategory);
                               }
                           }}
                       />
                   </ListItem>
                </List>
                </Demo>
            </Dialog>
        </div>
    );
};

export default Dropdown;