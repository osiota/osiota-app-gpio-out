<!--
Auto generated documentation:
  * Adapt schema.json and
  * Run npm run doc

Please edit schema.json or
	https://github.com/simonwalz/osiota-dev/blob/master/partials/main.md
-->
<a name="root"></a>
# osiota application GPIO out

*Osiota* is a software platform capable of running *distributed IoT applications* written in JavaScript to enable any kind of IoT tasks. See [osiota](https://github.com/osiota/osiota).

## Configuration: gpio-out


This application allows controlling GPIO pins.

**Properties**

|Name|Description|Type|
|----|-----------|----|
|`pin` (Pin number)|Not GPIO number ([See pin naming](https://www.npmjs.com/package/rpi-gpio#pin-naming))<br/>|number|
|`initial_value` (Initial Output Value)|Enum: `[0,1]`<br/>|number|
|`invert` (Invert Output Value)|e.g. for a pull down circuit<br/>|boolean|

**Additional Properties:** `false`<br/>
**Example**

```json
{
    "pin": 7,
    "initial_value": 0,
    "invert": true
}
```


## How to setup

Add a configuration object for this application, see [osiota configuration](https://github.com/osiota/osiota/blob/master/doc/configuration.md):

```json
{
    "name": "gpio-out",
    "config": CONFIG
}
```

## License

Osiota and this application are released under the MIT license.

Please note that this project is released with a [Contributor Code of Conduct](https://github.com/osiota/osiota/blob/master/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
