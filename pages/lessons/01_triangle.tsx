import { useEffect, useRef } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark, github } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import dracula from "react-syntax-highlighter/dist/cjs/styles/hljs/dracula";
import { clearInterval } from "timers";



const htmlCode = 
`<html>
  <body>
    <canvas id="viewport" width="640" height="480"></canvas>
  </body>
</html>`;



const init_webgl_context = 
`const canvas = document.getElementById("viewport");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const gl = canvas.getContext("webgl");`;

const test_context = 
`gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);`;

const init_vertex_shader = 
`const vs_source = \`
attribute vec4 a_Position;
attribute vec4 a_Color;

varying vec4 fs_Color;

void main() {
	gl_Position = a_Position;
	fs_Color = a_Color;
}\`;
const vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vs_source);
gl.compileShader(vs);
if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
	console.error(\`Error compiling shader: \${gl.getShaderInfoLog(vs)}\`);`;

const init_fragment_shader = 
`const fs_source = \`
precision mediump float;

varying vec4 fs_Color;

void main() {
	gl_FragColor = fs_Color;
}\`;
const fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fs_source);
gl.compileShader(fs);
if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
	console.error(\`Error compiling shader: \${gl.getShaderInfoLog(fs)}\`);`;

const init_shader_program = 
`const shader = gl.createProgram();
gl.attachShader(shader, vs);
gl.attachShader(shader, fs);
gl.linkProgram(shader);`;

const array_buffer = 
`const data = new Float32Array([
	[[-0.5, -0.5, 0, 1], [1, 0, 0, 1]], 
	[[+0.5, -0.5, 0, 1], [0, 1, 0, 1]], 
	[[+0.0, +0.5, 0, 1], [0, 0, 1, 1]], 
].flat(3));
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);`;

function triangle (canvas: HTMLCanvasElement) {

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const gl = canvas.getContext("webgl") as WebGLRenderingContext;
gl.clearColor(1.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
const shader = (()=>{
	const vs_source = `
	attribute vec4 a_Position;
	attribute vec4 a_Color;

	varying vec4 fs_Color;

	void main() {
		gl_Position = a_Position;
		fs_Color = a_Color;
	}`;
	const fs_source = `
	precision mediump float;

	varying vec4 fs_Color;
	
	void main() {
		gl_FragColor = fs_Color;
	}`;
	const vs = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
	gl.shaderSource(vs, vs_source);
	gl.compileShader(vs);
	if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
		console.error(`Error compiling shader: ${gl.getShaderInfoLog(vs)}`);
	const fs = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
	gl.shaderSource(fs, fs_source);
	gl.compileShader(fs);
	if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
		console.error(`Error compiling shader: ${gl.getShaderInfoLog(fs)}`);
	const prog = gl.createProgram() as WebGLProgram;
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	return prog;
})();

const array_buffer = (()=>{
	const data = new Float32Array([
		[[-0.5, -0.5, 0, 1], [1, 0, 0, 1]], 
		[[+0.5, -0.5, 0, 1], [0, 1, 0, 1]], 
		[[+0.0, +0.5, 0, 1], [0, 0, 1, 1]], 
	].flat(3));
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

	const a_Position_location = gl.getAttribLocation(shader, "a_Position");
	gl.vertexAttribPointer(
		a_Position_location,
		4,
		gl.FLOAT,
		false,
		data.BYTES_PER_ELEMENT * 8,
		data.BYTES_PER_ELEMENT * 0,
	);
	gl.enableVertexAttribArray(a_Position_location);
	
	const a_Color_Location = gl.getAttribLocation(shader, "a_Color");
	gl.vertexAttribPointer(
		a_Color_Location,
		4,
		gl.FLOAT,
		false,
		data.BYTES_PER_ELEMENT * 8,
		data.BYTES_PER_ELEMENT * 4,
	);
	gl.enableVertexAttribArray(a_Color_Location);
	return buffer;
})();

const draw = () => {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
	console.log("Draw");
	gl.clearColor(0, 0, 0, 0.3);
	gl.clearDepth(1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, array_buffer);
	gl.useProgram(shader);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
};

draw();
const draw_interval_id = setInterval(draw, 1000);
console.log(draw_interval_id);
return draw_interval_id;

};


const CodeSnippet = (props: {children: string, lang?: string, tabWidth?: number}) => {
	const tabWidth = props.tabWidth ?? 2;
	const lang = props.lang ?? "javascript";

	const customStyle = {
		margin: 0
	} as any;
	return <><></>
	<p style={{margin: 0}}>Title</p>
	<div style={{marginTop: "16px", fontSize: "1rem", overflow: "hidden", borderRadius: "0.5rem"}}>
	<SyntaxHighlighter language={lang} style={a11yDark} customStyle={customStyle}>
		{props.children}
	</SyntaxHighlighter>

	</div>
	</>
}

const Lesson = () => {

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvasElement = canvasRef.current;
		if(canvasElement) {
			const id = triangle(canvasElement);
			console.log(id);
			return () =>{
				console.log(id);
				// clearInterval(id);
			}
		};
	}, [])



	return <>
	<div style={{
		width: "70%",
		minHeight: "50vh",
		backgroundColor: "rgba(216, 216, 216, 1)",
		borderRadius: "1rem",
		margin: "20px auto 0 auto",
		padding: "0 2rem 0 2rem",
		}}>

		
		<h1 style={{width: "100%", padding: "0.5rem 0 0 0", textAlign: "center"}}>Lesson 1: Triangle</h1>

		<p>{"WebGL (Website Graphics Library) is a web based implemention of the OpenGL ES (Open Graphics Library for Embedded Systems) graphics API. It allows for the development of 2D and 3D graphics within the web browser, and facilitates a computer's built in graphics processing hardware to allow for high performance rendering."}</p>
		<p>{"Hello WebGL is a series of interactive tutorials for learning WebGL, and is intended for new users who have little experience with computer graphics."}</p>
		<p>{"This first lesson will take you through the basics of creating a WebGL context, and completing the necessary setup to render a triangle onto the screen"}</p>
		{/* OpenGL, and by extension WebGL, is a state machine-based graphics API. We can 
		
		
		When we want to render an object 
		using OpenGL we first must set up the state ready for the datato  */}
		<CodeSnippet lang="html">
			{htmlCode}
		</CodeSnippet>
		<CodeSnippet>{init_webgl_context}</CodeSnippet>
		<CodeSnippet>{test_context}</CodeSnippet>
		<CodeSnippet>{init_vertex_shader}</CodeSnippet>
		<CodeSnippet>{init_fragment_shader}</CodeSnippet>
		<CodeSnippet>{init_shader_program}</CodeSnippet>
		<CodeSnippet>{array_buffer}</CodeSnippet>

		{/* <SyntaxHighlighter language="javascript" style={dracula}>
		
			{init_fragment_shader}
		</SyntaxHighlighter> */}

		{/* <CodeSnippet>
			{`${triangle}`}
		</CodeSnippet> */}

		<canvas ref={canvasRef} id="viewport" style={{width: "100%", aspectRatio: "2 / 1"}}></canvas>
		<></>
	</div>
	
	</>

}

export default Lesson;