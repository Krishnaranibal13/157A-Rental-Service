import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { VideoGames, Movies, MediaMixed } from "../interfaces/MediaInterfaces";
import useUser  from "../hooks/useUser";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ReusableBar from "../components/ReusableBar";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { InCart, CartSubmit } from "../interfaces/cart";
import { useNavigate } from "react-router-dom";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#CCDEFF",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const CartCheckout:React.FC = () => {
    const userContextValue = useUser();
    const axiosPrivate = useAxiosPrivate();
    const user = userContextValue?.user;
    const navigate = useNavigate();
    const [ videoGames, setVideoGames ] = useState<VideoGames[]>();
    const [ movies, setMovies ] = useState<Movies[]>();


    const getMediaInCart = async () => {
        let isMounted = true;
        const controller = new AbortController();
        try {
            const response = await axiosPrivate.get(`/cart/in/${user?.cart_id}`,{
                signal: controller.signal,
            });
            
            if(isMounted){
                const media: MediaMixed = response.data;
                setVideoGames(media.video_games);
                setMovies(media.films);
            }

        } catch (error) {
             console.log(error);   
            }
    };

    useEffect(() =>{
        getMediaInCart();

    },[]);

    const removeMediaFromCart = async (media_id: number) => {
        let isMounted = true;
        const controller = new AbortController();
        try {
            const body: InCart = {
                media_id: media_id,
                cart_id: user?.cart_id ? user.cart_id : -1,
            };
            const response = await axiosPrivate.delete(`/cart/in/remove`, { data: body });
            if (isMounted) {
                getMediaInCart();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onCartCheckout = async () => {
        try {
            const body: CartSubmit = {
                rent_duration: 17,
                user_id: user?.user_id ? user.user_id : -1,
                cart_id: user?.cart_id ? user.cart_id : -1,
            };
            const response = await axiosPrivate.post(`/tran/transaction`, body);
            navigate("/home");
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div>
            <div style={{marginBottom: 75}}>
                <ReusableBar title = "Search Page"  showInventoryIcon = {false} />
            </div>
            <div>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
                <TableRow>
                <StyledTableCell>Cover</StyledTableCell>
                <StyledTableCell align="center">Title</StyledTableCell>
                <StyledTableCell align="center">Rating</StyledTableCell>
                <StyledTableCell align="center">Genre</StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">Remove from Cart</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {videoGames?.map((row) => (
                <StyledTableRow key={row.media_id}>
                    <StyledTableCell component="th" scope="row">
                        <img style={{height: 80}} src={row.image_url} alt={row.title}/>
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.title}</StyledTableCell>
                    <StyledTableCell align="center">{row.rating}</StyledTableCell>
                    <StyledTableCell align="center">{row.genre}</StyledTableCell>
                    <StyledTableCell align="center">Publisher: {row.publisher}</StyledTableCell>
                    <StyledTableCell align="center">Developer:{row.developer}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Button onClick={() => removeMediaFromCart(row.media_id ? row.media_id : -1)} size="large">
                             <DeleteIcon fontSize="large" color="error" />
                        </Button>
                    </StyledTableCell>
                </StyledTableRow>
                ))}
                {movies?.map((row) => (
                <StyledTableRow key={row.media_id}>
                    <StyledTableCell component="th" scope="row">
                        <img style={{height: 80}} src={row.image_url} alt={row.title}/>
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.title}</StyledTableCell>
                    <StyledTableCell align="center">{row.rating}</StyledTableCell>
                    <StyledTableCell align="center">{row.genre}</StyledTableCell>
                    <StyledTableCell align="center">runtime: {row.runTime}</StyledTableCell>
                    <StyledTableCell align="center">Director:{row.director}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Button onClick={() => removeMediaFromCart(row.media_id ? row.media_id : -1)} size="large">
                            <DeleteIcon fontSize="large" color="error" />
                        </Button>
                    </StyledTableCell>
                </StyledTableRow>
                ))}
            </TableBody>
            </Table>
            </TableContainer>
            <br />
            <Button onClick={onCartCheckout} size="large">
                <ShoppingCartCheckoutIcon fontSize="large" color="success" />
            </Button>
            </div>
        </div>
    );
}; 

export default CartCheckout;
