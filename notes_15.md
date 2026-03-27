# Watch history
User model ki Watch history ek array hai usko videos se join karege toh woh populate ho jayega but har video ke paas ek owner naam ki field hai jo wapas se user se join hogi , ham iske liye nested lookup krege .     
## subpipelines 
we first did populated watchhistory with the actual videos ( the actual logic of this is not in this video that how to know who has watched which video (tracking)) and then these videos must conatin the info of who uploaded them so that we can display it in the history at frontend.      
user controller mein ek new controller ----> getWatchHistory

Also note one thing that , mongodb mein jo _id Store hoti hai woh kuch is format mein hoti hai : ObjectID('5sd4g88ardafa') but jab ham req.user etc karte hain toh mongoose usko sirf string laake deta hai .      
also jab ham findbyid etc krte tym wahi string dete hain toh mongoose wapas se ye string conversion handle kr leta hai. 

but yaha par ham data lenge req.user se and then uspe aggregation pipeline likhege , aur ye pipeline directly jaati hai and mongoose unko handle nahi karta so we need to convert them to object id while giving their refrence within the match field      

now  , controller hogya ab routes set kar dete hai jo bche hain

note : router.route("/channel/:username") params wala data aise hi lete hain /c toh kch v likho par / ke baad : laga ke jo likhte hain woh important hai

## iske baad like comment tweet and playlist model ko eraser io file ke according bana liye simply


## cloudinary ke andr video ka response 
```
file has been uploaded succesfully http://res.cloudinary.com/mainabhayhoon/video/upload/v1772617736/ezfm4qfsntri6ha25r2i.mp4
{
  asset_id: '726417f546214f584e208af5a46ba2e9',
  public_id: 'ezfm4qfsntri6ha25r2i',
  version: 1772617736,
  version_id: '860c1e45bd59f2a7b5aa7ac59531bc7c',
  signature: 'dc5597f12602e8043f13bbcd1507929e1c0c9b84',
  width: 1920,
  height: 1080,
  format: 'mp4',
  resource_type: 'video',
  created_at: '2026-03-04T09:48:56Z',
  tags: [],
  pages: 0,
  bytes: 5231927,
  type: 'upload',
  etag: 'af05328178ba5fe7860a6b8f24ab25af',
  placeholder: false,
  url: 'http://res.cloudinary.com/mainabhayhoon/video/upload/v1772617736/ezfm4qfsntri6ha25r2i.mp4',
  secure_url: 'https://res.cloudinary.com/mainabhayhoon/video/upload/v1772617736/ezfm4qfsntri6ha25r2i.mp4',
  playback_url: 'https://res.cloudinary.com/mainabhayhoon/video/upload/sp_auto/v1772617736/ezfm4qfsntri6ha25r2i.m3u8',
  asset_folder: '',
  display_name: 'ezfm4qfsntri6ha25r2i',
  audio: {
    codec: 'aac',
    bit_rate: '191268',
    frequency: 48000,
    channels: 2,
    channel_layout: 'stereo'
                },
  video: {
    pix_format: 'yuvj420p',
    codec: 'h264',
    level: 40,
    profile: 'Main',
    bit_rate: '13156282',
    dar: '16:9',
    time_base: '1/30000'
                },
  is_audio: false,
  frame_rate: 30,
  bit_rate: 13247568,
  duration: 3.1374,
  rotation: 0,
  original_filename: 'WIN_20260304_15_13_01_Pro',
  nb_frames: 95,
  api_key: '719417936975164'
}
```