import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchPrices = async (frameName, frameCategory) => {
  try {
    const response = await axios.get(`${apiUrl}/calculator/price`, {
      params: { frameName, frameCategory },
    });

    const { profilePrice, laborPrice } = response.data;

    return {
      profilePricePerMeter: parseFloat(profilePrice),
      laborPrice: parseFloat(laborPrice),
    };
  } catch (error) {
    console.error("Грешка при извличане на цените:", error);
    return { profilePricePerMeter: NaN, laborPrice: NaN };
  }
};

export const calculateSinglePrice = (
  profilePricePerMeterInnerFrame,
  laborPriceInnerFrame,
  profilePricePerMeterOuterFrame,
  laborPriceOuterFrame,
  frameWidth,
  frameHeight,
  includeSubframe,
  includeGobelinStretching,
  includeHangingOption,
  includeBack,
  includeGlass,
  includeMirror,
  includeMatboard,
  matboardWidth
) => {
  if (
    !isNaN(profilePricePerMeterInnerFrame) &&
    !isNaN(frameWidth) &&
    !isNaN(frameHeight) &&
    !isNaN(laborPriceInnerFrame) &&
    !isNaN(frameHeight)
  ) {
    const perimeter = calculatePerimeter(frameWidth, frameHeight);
    const totalProfilePrice1 = calculateProfilePrice(
      perimeter,
      profilePricePerMeterInnerFrame
    );
    const totalProfilePrice2 = !isNaN(profilePricePerMeterOuterFrame)
      ? calculateProfilePrice(perimeter, profilePricePerMeterOuterFrame)
      : 0;
    const totalLaborPrice = laborPriceInnerFrame + (laborPriceOuterFrame || 0);
    const subframePrice = includeSubframe
      ? calculateSubframePrice(perimeter)
      : 0;
    const gobelinStretchingPrice = includeGobelinStretching
      ? calculateGobelinStretchingPrice(perimeter)
      : 0;
    const hangingOptionPrice = includeHangingOption
      ? calculateHangingOptionPrice(
          frameWidth,
          frameHeight,
          includeHangingOption
        )
      : 0;
    const backingPrice = includeBack
      ? calculateBackingPrice(frameWidth, frameHeight)
      : 0;
    const glassPrice = includeGlass
      ? calculateGlassPrice(frameWidth, frameHeight)
      : 0;
    const mirrorPrice = includeMirror
      ? calculateMirrorPrice(frameWidth, frameHeight)
      : 0;
    const matboardPrice = includeMatboard
      ? calculateMatboardPrice(frameWidth, frameHeight, matboardWidth)
      : 0;

    return calculateTotalPrice(
      totalProfilePrice1 + totalProfilePrice2,
      totalLaborPrice,
      subframePrice,
      gobelinStretchingPrice,
      hangingOptionPrice,
      backingPrice,
      glassPrice,
      mirrorPrice,
      matboardPrice
    );
  }
  return parseFloat((0).toFixed(2));
};

export const calculateTotalPrice = (
  totalProfilePrice,
  laborPrice,
  subframePrice,
  gobelinStretchingPrice,
  hangingOptionPrice,
  backingPrice,
  glassPrice,
  mirrorPrice,
  matboardPrice
) => {
  const totalPrice =
    totalProfilePrice +
    laborPrice +
    subframePrice +
    gobelinStretchingPrice +
    hangingOptionPrice +
    backingPrice +
    glassPrice +
    mirrorPrice +
    matboardPrice;
  return parseFloat(totalPrice.toFixed(2));
};

export const calculateFinalPriceWithQuantity = (
  singlePrice,
  framesQuantity
) => {
  return parseFloat((singlePrice * framesQuantity).toFixed(2));
};

export const calculatePerimeter = (frameWidth, frameHeight) => {
  return 2 * (frameWidth + frameHeight);
};

export const calculateProfilePrice = (perimeter, profilePricePerMeter) => {
  return perimeter * (profilePricePerMeter / 100);
};

export const calculateSubframePrice = (perimeter) => {
  return perimeter * 0.09;
};

export const calculateGobelinStretchingPrice = (perimeter) => {
  return perimeter * 0.05;
};

export const calculateHangingOptionPrice = (
  frameWidth,
  frameHeight,
  includeHangingOption
) => {
  if (includeHangingOption !== "не") {
    const largerDimension = Math.max(frameWidth, frameHeight);
    if (largerDimension <= 30) {
      return 0.4;
    } else if (largerDimension <= 50) {
      return 1.2;
    } else if (largerDimension <= 70) {
      return 1.8;
    } else {
      return 2.4;
    }
  }
  return 0;
};

export const calculateBackingPrice = (frameWidth, frameHeight) => {
  const backingArea = (frameWidth / 100) * (frameHeight / 100);
  const backingPrice = backingArea * 5;
  return parseFloat(backingPrice.toFixed(2));
};

export const calculateGlassPrice = (frameWidth, frameHeight) => {
  const glassArea = (frameWidth / 100) * (frameHeight / 100);
  const glassPrice = glassArea * 35;
  return parseFloat(glassPrice.toFixed(2));
};

export const calculateMirrorPrice = (frameWidth, frameHeight) => {
  const mirrorArea = (frameWidth / 100) * (frameHeight / 100);
  const mirrorPrice = mirrorArea * 50;
  return parseFloat(mirrorPrice.toFixed(2));
};

export const calculateMatboardPrice = (
  frameWidth,
  frameHeight,
  matboardWidth
) => {
  if (matboardWidth >= frameWidth || matboardWidth >= frameHeight) {
    return 0;
  }
  const totalWidth = frameWidth + 2 * matboardWidth;
  const totalHeight = frameHeight + 2 * matboardWidth;
  const matboardArea = totalWidth * totalHeight;
  const matboardAreaInMeters = matboardArea / 10000;
  const matboardPrice = matboardAreaInMeters * 20;

  return parseFloat(matboardPrice.toFixed(2));
};
