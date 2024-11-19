import React, { useState } from "react";
import { Box,IconButton, Modal, Backdrop } from "@mui/material";
import { theme } from "../../assets/themes/theme";
import videoThumbImg from "../../assets/images/video-thumb.png";
import { Icon } from "@iconify/react";


export default function VideoThumb(): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box position={"relative"}>
        <img
          src={videoThumbImg}
          width={"100%"}
          style={{
            boxShadow: "0px 2px 10px 0px rgba(0,0,0,0.1)",
            borderRadius: 10,
          }}
        />
        <Box
          bgcolor={theme.palette.secondary.main}
          borderRadius={2}
          width={24}
          height={24}
          position={"absolute"}
          bottom={"8%"}
          right={"43%"}
          p={1}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          boxShadow={"0px 4px 4px 0px rgba(0,0,0,0.25)"}
        >
          <IconButton onClick={handleOpen}>
            <Icon
              icon="solar:play-bold"
              fontSize={26}
              color="#fff"
              style={{
                filter: "drop-shadow(0px 3px 0px rgba(0, 0, 0, 0.25))",
              }}
            />
          </IconButton>
        </Box>
      </Box>

      <Modal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box
          style={{
            position: "relative",
            width: "80%",
            maxWidth: 800,
            paddingTop: "56.25%", // 16:9 aspect ratio
          }}
        >
           <iframe
            style={{
              position: "absolute",
              top: "10%",
              left: 0,
              width: "100%",
              height: "60%",
            }}
            src="https://www.youtube.com/embed/QB-uiggHGcU?autoplay=1" // Add autoplay parameter
            frameBorder="0"
            allowFullScreen
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </Box>
      </Modal>
    </>
  );
}
