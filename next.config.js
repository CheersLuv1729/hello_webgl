/** @type {import('next').NextConfig} */

const { PHASE_DEVELOPMENT_SERVER, PHASE_EXPORT, PHASE_PRODUCTION_BUILD } = require('next/dist/shared/lib/constants');


module.exports = (phase, {defaultConfig}) => {
	if(phase == PHASE_DEVELOPMENT_SERVER)
	{
		
	};
	if(phase == PHASE_EXPORT || phase == PHASE_PRODUCTION_BUILD)
	{
		return {
			reactStrictMode: true,
			swcMinify: true,
			images: {
			  unoptimized: true,
			},
			basePath: "/hello_webgl",
			assetPrefix: "/hello_webgl",
		}
	};
	return {
		reactStrictMode: true,
		swcMinify: true,
	}
}