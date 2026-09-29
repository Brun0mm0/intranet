import { useRef, useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, CardActionArea, Box, Typography } from "@mui/material";

const MIN_ANGLE = 200;
const MAX_ANGLE = 340;
const START_ANGLE = 270;
const SPEED = 0.3;

export default function AccesoRapidoCard({ item, padding = 1 }) {
    const Icon = item.icon;
    const comingSoon = item.comingSoon;
    const actionAreaRef = useRef(null);
    const angleRef = useRef(START_ANGLE);
    const directionRef = useRef(1);
    const rafRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (!isHovering) {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (actionAreaRef.current) {
                actionAreaRef.current.style.backgroundImage = '';
            }
            angleRef.current = START_ANGLE;
            directionRef.current = 1;
            return;
        }
        const animate = () => {
            let next = angleRef.current + directionRef.current * SPEED;

            if (next >= MAX_ANGLE) {
                next = MAX_ANGLE;
                directionRef.current = -1;
            } else if (next <= MIN_ANGLE) {
                next = MIN_ANGLE;
                directionRef.current = 1;
            }

            angleRef.current = next;

            if (actionAreaRef.current) {
                actionAreaRef.current.style.backgroundImage =
                    `linear-gradient(${angleRef.current}deg, rgba(0,169,218,.5) 0%, rgba(175,218,237,0.3) 45%, rgba(226, 226, 226, 1) 55%, rgba(2,181,126,.5) 100%)`;
            }
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [isHovering]);

    return (
        <Card variant="outlined" sx={{ width: '100%', p: 0 }}>
            <CardActionArea
                ref={actionAreaRef}
                component={comingSoon ? 'div' : RouterLink}
                to={comingSoon ? undefined : `/${item.path}`}
                disabled={comingSoon}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                sx={{
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'scale(1.05)'},
                    '&:hover .MuiCardActionArea-focusHighlight': { opacity: 0 },
                }}
            >
                <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={0.5} p={padding}>
                    {Icon && <Icon fontSize="medium" />}
                    <Typography color={comingSoon ? 'text.disabled' : 'text.primary'}>
                        {item.label}
                    </Typography>
                    {comingSoon && (
                        <Typography variant="caption" color="text.disabled">
                            (próximamente)
                        </Typography>
                    )}
                </Box>
            </CardActionArea>
        </Card>
    );
}