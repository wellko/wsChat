import React from 'react';
import {IUser, Message} from "../types";
import MessageForm from "../components/MessageForm";
import {Box, Container, Grid} from "@mui/material";
import OnlineList from "../components/OnlineList";

interface props {
    messages: Message[],
    onSubmit: (arg: string) => void;
    online: IUser[],
}

const ChatPage: React.FC<props> = ({messages, onSubmit, online}) => {

    return (
        <Container>
            <Grid container>
                <Grid item xs={3}>
                    <OnlineList users={online}/>
                </Grid>
                <Grid item xs={9} maxHeight="800px" overflow='scroll'>
                    {messages.map((el) =>
                        <p key={Math.random()}><b>{el.author.displayName}:</b> {el.text}</p>
                    )}
                </Grid>

            </Grid>
            <Box sx={{position: 'sticky', bottom: '0px', left: '0px', width: '100%', zIndex: '99', bgcolor: 'FFF'}}>
                <MessageForm submitFormHandler={onSubmit}/>
            </Box>
        </Container>
    );
};

export default ChatPage;