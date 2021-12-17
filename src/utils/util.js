export const shiftFunction = (shift) => {
    switch (shift) {
        case 'S1':
            return 'S1 - 00.00 - 08.00 WIB';
        case 'S2':
            return 'S2 - 08.00 - 16.00 WIB';
        case 'S3':
            return 'S3 - 16.00 - 24.00 WIB';
        default:
            return 'Shift';
    }
}