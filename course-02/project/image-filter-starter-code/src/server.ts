import express from 'express';
import validator from 'validator';
import bodyParser from 'body-parser';
import {Request, Response} from 'express';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query //
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get( "/filteredimage", async ( req: Request, res: Response ) => {
    
    let image_url: string = req.query.image_url;
    if (!image_url) {
      return res.status(400).send({message: `image URL is required`});
    }
    if (validator.isURL(image_url)) {
      try {
        const filteredPath = await (await filterImageFromURL(image_url)).toString();
        res.sendFile(filteredPath);
        res.on('finish', function () {
          try {
            deleteLocalFiles([filteredPath]);
          } catch(err) {
            console.log("error removing ", filteredPath);
          }
        })
      } catch (err) {
          return res.status(404).send("file not found");
      } 
      } else {
        res.send("Please provide a valid URL!!!");
      }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();