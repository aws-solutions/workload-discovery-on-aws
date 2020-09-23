import { fetchImage, fetchLogo } from '../../Utils/ImageSelector';

test('fetches image with type' , () => {
    const image = fetchImage('AWS::EC2::Instance');
    expect(image).toMatch(`icons/Amazon-EC2_Instance_light-bg.svg`);
})

test('fetches image with type and status' , () => {
    const image = fetchImage('AWS::EC2::Subnet', {status: 'status-warning'});
    expect(image).toMatch(`icons/VPC-subnet-private_light-bg-warning.svg`);
})

test('fetches image with status' , () => {
    const image = fetchImage(undefined, {status: 'status-warning'});
    expect(image).toMatch(`icons/status-warning.svg`);
})

test('fetches nothing with undefined' , () => {
    const image = fetchImage(undefined);
    expect(image).toBeUndefined();        
})

test('fetches nothing with not a real type' , () => {
    const image = fetchImage('AWS::EBS::Volume');
    expect(image).toBeUndefined();       
})

test('fetches transparent logo' , () => {
    const image = fetchLogo(true);
    expect(image).toMatch(`icons/AWS-Zoom-trans-bg.svg`);
})

test('fetches non-transparent logo' , () => {
    const image = fetchLogo(false);
    expect(image).toMatch(`icons/AWS-Zoom_light-bg.svg`);
})