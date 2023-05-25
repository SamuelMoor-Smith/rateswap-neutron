import { useColorModeValue } from "@chakra-ui/react";

export const UseCustomColors = () => {

    const white_or_black = useColorModeValue('white', 'black');

    const orange300_or_orange300 = useColorModeValue("orange.300", "orange.300");

    const gray_or_white = useColorModeValue('0 0 2px gray', '0 0 2px white')
    const gray50_or_whiteAlpha200 = useColorModeValue('gray.50', 'whiteAlpha.200')
    const gray100_or_gray700 = useColorModeValue('gray.100', 'gray.700');
    const gray100_or_whiteAlpha300 = useColorModeValue('gray.100', 'whiteAlpha.300');

    const primary100_or_primary500 = useColorModeValue('primary.100', 'primary.500');
    const primary500_or_primary300 = useColorModeValue('primary.500', 'primary.300');
    const primary700_or_primary200 = useColorModeValue("primary.700", "primary.200")

    const blackAlpha50_or_whiteAlpha50 = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
    const blackAlpha100_or_whiteAlpha100 = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
    const blackAlpha200_or_whiteAlpha200 = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
    const blackAlpha200_or_whiteAlpha400 = useColorModeValue('blackAlpha.200', 'whiteAlpha.400');
    const blackAlpha300_or_whiteAlpha300 = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');
    const blackAlpha300_or_whiteAlpha600 = useColorModeValue('blackAlpha.300', 'whiteAlpha.600');
    const blackAlpha400_or_whiteAlpha400 = useColorModeValue("blackAlpha.400", "whiteAlpha.400");
    const blackAlpha400_or_whiteAlpha500 = useColorModeValue('blackAlpha.400', 'whiteAlpha.500');
    const blackAlpha400_or_whiteAlpha600 = useColorModeValue('blackAlpha.400', 'whiteAlpha.600');
    const blackAlpha500_or_whiteAlpha600 = useColorModeValue('blackAlpha.500', 'whiteAlpha.600');
    const blackAlpha600_or_whiteAlpha600 = useColorModeValue('blackAlpha.600', 'whiteAlpha.600');
    const blackAlpha700_or_whiteAlpha700 = useColorModeValue('blackAlpha.700', 'whiteAlpha.700');
    const blackAlpha800_or_whiteAlpha800 = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
    const blackAlpha800_or_whiteAlpha900 = useColorModeValue('blackAlpha.800', 'whiteAlpha.900');
    const blackAlpha900_or_whiteAlpha900 = useColorModeValue('blackAlpha.900', 'whiteAlpha.900');

    const whiteAlpha500_or_whiteAlpha50 = useColorModeValue('whiteAlpha.500', 'whiteAlpha.50');

    const color1 = useColorModeValue(
        'rgba(0,0,0,0.3) rgba(0,0,0,0.2)',
        'rgba(255,255,255,0.2) rgba(255,255,255,0.1)'
      )
    const color2 = useColorModeValue(
        'rgba(160,160,160,0.1)',
        'rgba(255,255,255,0.1)'
      )
    const color3 = useColorModeValue(
        'rgba(0,0,0,0.1)',
        'rgba(255,255,255,0.1)'
      )
    const color4 = useColorModeValue("#f5f5f5", "whiteAlpha.50")
    const color5 = useColorModeValue(
        "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.06);",
        "0 4px 10px -3px rgba(255,255,255,0.2)"
      )

    return { white_or_black, orange300_or_orange300, gray_or_white, gray50_or_whiteAlpha200, gray100_or_gray700, gray100_or_whiteAlpha300, primary100_or_primary500, primary500_or_primary300, primary700_or_primary200, blackAlpha50_or_whiteAlpha50, blackAlpha100_or_whiteAlpha100, blackAlpha200_or_whiteAlpha200, blackAlpha200_or_whiteAlpha400, blackAlpha300_or_whiteAlpha300, blackAlpha300_or_whiteAlpha600, blackAlpha400_or_whiteAlpha400, blackAlpha400_or_whiteAlpha500, blackAlpha400_or_whiteAlpha600, blackAlpha500_or_whiteAlpha600, blackAlpha600_or_whiteAlpha600, blackAlpha700_or_whiteAlpha700, blackAlpha800_or_whiteAlpha800, blackAlpha800_or_whiteAlpha900, whiteAlpha500_or_whiteAlpha50, blackAlpha900_or_whiteAlpha900, color1, color2, color3, color4, color5 };
};
