if (COMPAT)
window.PID = function (kp, ki, kd, min, max)
{	// default arguments
	this._kp = kp || (kp = 0);
	this._ki = ki || (ki = 0);
	this._kd = kd || (ki = 0);
	if (typeof min !== 'number') min = -Infinity;
	else if (typeof max !== 'number') max = Infinity;

	// setup for closure
	var errSum = 0;
	var lastError;
	
	// cache function
	var abs = Math.abs;
	
	this.set = function (setPoint)
	{   // backwards compatibility
		this._setPoint = setPoint;
	};
	this._setPoint = 0;
	
	// not referentially transparent
	this.compute = function (input, dt)
	{	kp = this._kp;
		ki = this._ki;
		kd = this._kd;

		var error = this._setPoint - input;
		lastError = error;
		
		// rate of change of input, delta input over time
		var dError = (error - lastError) / dt;
		
		errSum += error * dt;
		var proportional = kp * error;
		var integral = ki * errSum;
		var derivative = kd * dError;
		
		// correct integrator windup - _pureOutput is value before correction
		var output = this._pureOutput = proportional + integral + derivative;
		
		if (ki)
			if (output > max) 
			{	if (DEBUG) console.log(output, 'exceed max', abs(output - max) / ki, abs(output - max) / ki * ki);
				errSum -= abs(output - max) / ki;
			} else if (output < min)
			{	if (DEBUG) console.log(output, 'exceed min', abs(output - min) / ki, abs(output - min) / ki * ki);
				errSum += abs(output - min) / ki;
			}
			
		var correctedIntegral = ki * errSum;

		this._lastInput = input;
		this._proportional = proportional;
		this._integral = correctedIntegral;
		this._derivative = derivative;
		this._errSum = errSum;
		this._lastError = this._lastErr
						= lastError;
		return this._output = proportional + correctedIntegral + derivative;
	};
	
	this.reset = function ()
	{	if (DEBUG) console.log('pid reset');
		lastError = 0;
		errSum = 0;
	};
}