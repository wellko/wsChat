import React, { useState} from 'react';
import {Button, Grid, Paper, TextField} from "@mui/material";

interface props {
    submitFormHandler: (arg: string) => void;
}

const MessageForm: React.FC<props> = ({submitFormHandler}) => {
    const [state, setState] = useState<{ text: string }>({
        text: '',
    });
    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setState((prevState) => ({...prevState, [name]: value}));
    };

    const onSubmit: React.FormEventHandler = (e) => {
        e.preventDefault();
        submitFormHandler(state.text);
        setState({text: ''});
    }
    return (
        <Paper>
            <form autoComplete="off" onSubmit={onSubmit}>
                <Grid container direction="row" spacing={2}>
                    <Grid container item xs={12} alignContent=''>
                        <TextField
                            sx={{margin: 'auto', width: '60%'}}
                            label="Message"
                            name="text"
                            value={state.text}
                            onChange={inputChangeHandler}
                            required
                        />
                        <Button type="submit" color="primary" variant="contained">
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default MessageForm;