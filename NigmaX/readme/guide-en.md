# Field types

## Simple

* `string` - text;
* `array`  - text array;
* `int`    - number INT;
* `long`   - number LONG;
* `bool`   - true/false;


## Basic parcer methods
**replacer** - replace text

* `match  [string]` - matched text or regular expression,
* `text   [string]` - inserted text,
* `prefix [string]` - text inserted in front of the result,
* `sufix  [string]` - text inserted after the result.

***Example***
```json
"replace" : { 
	"match" : "\\?.*", 
	"text" : "" 
}
```

**get_string** - getting text value (text placed between token1 и token2) from document

* `after   [string]` - cursor is placed in front of the expression found,
* `skip    [string]` - cursor is placed after of the expression found,
* `before  [string]` - expression token1 searched before this expression,
* `tag     [string]` - Caution is not a search for the tag! This is positioning the cursor in front of tag,
* `token1, token2 [string]` - expression between where the results **[required]**,
* `replace [replacer]` - processing result,
* `details [bool]`   - logging **[debug]**.

***Example***

```json
author: { 
	"after": "<a href=\"/list/author/", 
	"token1":"\">", 
	"token2": "</a>" 
}
```

**detect** - check if the expression in the document

* `start    [string]` - expression from which start search area,
* `end      [string]` - expression which end search area,
* `pattern  [string]` - searching pattern,
* `patterns [array]`  - searching patterns.

**enum_detect** - set of detect with the ability to specify a default value - `default`

***Example***
Finding status for manga:
```json
"status": { 
	"complete": { 
		"start" : "<b>Перевод:</b>",
		"end" : "</p>",
		"values" : ["завершен", "Переведена", "Сингл"]
	},
	"ongoing": {
		"start" : "<b>Перевод:</b>",
		"end" : "</p>",
		"value" : "продолжается"
	},
	"single" : "<b>Сингл</b>",
	"default" : "ongoing"
}
```

**get_array** - getting array of string. 
If `split` specified then value between `token1` and `token2` will be sliced by split value (example 1),
If `split` not specified then array will be filled by all find values between token1 and token2 (example 2).

* `start   [string]` - expression from which start search area,
* `end     [string]` - expression which end search area,
* `after   [string]` - expression which shift cursor,
* `split   [string]` - expression which slice returning value,
* `token1, token2 [string]` - ,
* `replace [replacer]` - processing each value,
* `details [bool]`   - logging **[debug]**;

***Example 1***
The result is a list of all elements separated by commas in the element "span".
```json
{
	split: ",",
	token1: "<span>", 
	token2: "</span>"
}
```
***Example 2***
The result is a list of all elements between "li" in "ul".
```json
{
	start: "<ul>", 
	end: "</ul>", 
	token1: "<li>", 
	token2="</li>"
}
```

**add_href** - getting links (title, link, uniq - unique value part of the path for the formation of a folder) to manga/chapter.

* `start   [detect]`     - выражение начала окна,
* `end     [detect]`     - выражение окончания окна,
* `next    [detect]`     - выражение смещения курсора поиска,
* `link    [get_string]` - getting link,
* `title   [get_string]` - getting title,
* `uniq    [get_string]` - getting unique identifier, if not specified then formed from the last path segment,
* `details [bool]`       - logging **[debug]**.

**get_iterator** - iterator values, used to generate a list of urls.

* `base_url [string]` - basic url,
* `append_nums` - loop for making list of urls formed as `base_url` + %index% + `sufix`
	* `from  [int]`
	* `to    [int]`
	* `step  [int]`
	* `sufix [string]`
* `append_array [array]` - array of string values for making list of urls formed as `base_url` + %value%

***Example***
Making list of urls like: http://adultmanga.ru/list?offset=0, http://adultmanga.ru/list?offset=60, http://adultmanga.ru/list?offset=120...
```json
"iterator": {
	"base_url": "http://adultmanga.ru/list?offset=",
	"append_nums": { "from": 0, "to": 6300, "step": 60 }
},
```

# Header fields of parser

* `id [long]` - site site identifier (a relic of the past....),
* `version [string]` - version of the file, the application will take the greatest version or local,
* `self_link [string] - link to manga list file (protobuf),
* `title [string]` - Parser title **[required]**,
* `host [string]` - Site hostname **[required]**,
* `public_link [string]` - url to the manga catalog (for user),
* `folder [string]` - folder name where manga stored on sd card **[required]**,
* `name [string]` - short name **[not required]**,
* `language [string]` - site language code **ISO 639-1** http://en.wikipedia.org/wiki/ISO_639-1,
* `chapters_order [bool]` - order of chapters on manga page (true - 1,2,3  false: 501,500,499...), by defaul is `true`
* `time_invalidate [long]` - **[not used]**.


# Methods for making manga DB

**manga_list_complete** - methods for making list of manga ( title, link, uniq );

* `iterator  [string|array|get_iterator]` - making manga catalog url list;
* `add_manga [add_href]` - method for making list of manga (title, link, uniq) for each page of catalog;

**manga_complete** - methods for filling fields of each manga;

* `title       [get_string]` - manga title;
* `author      [get_string]` - manga author;
* `summary     [get_string]` - description of manga;
* `cover       [get_string]` - cover of manga;
* `rating      [get_string]` - rating of magna on this site;
* `is_mature   [detect]` - this is manga for mature;
* `read_dir    [enum_detect]` - reading derection
	* `left_to_right` - reading left to right, 
	* `right_to_left` - reading right to left;
* `status      [enum_detect]` - status of manga
	* `unknown`,
	* `ongoing`,
	* `complete`,
	* `single`,
	* `licensed` - licensed/blocked,
	* `empty`.
* `chapters_from_page [get_string]` - making chapters list from other url. For example on many site you can see pagination for chapter list, in this case you can making list of chapters from reading page.
* `add_genre   [get_string]` - add each genre one by one,
* `add_genres  [get_array]` - add all genres,
* `add_chapter [add_href]` - making chapters list.

**chapter_complete** - methods for filling page list for each chapter.

* `add_page     [get_string]` - add each page one by one;
* `add_pages    [get_array]` - add all page list with links to pages (with images);
* `add_images   [get_array]` - app all page list with links to images;
* `images_url   [get_string]` - ;
* `postfix      [string]` - ;
* `prefix       [get_string]` - ;
* `sufix        [get_string]` - ;
* `remove_first [bool]` - remove fisrt page from list;
* `remove_last  [bool]` - remove last page from list;

**page_complete** - methods getting url to image from html page;

* `image [get_string]` - extracting url to the image;

**test** - testing this file;

* `proc [string]` - method which will tested;
* `link [string]` - url to manga/chapter/page for making test object;
* `assert` - ;

	***Сompare the values***

	* Сompare text values

		* equal
			`"author" : "OKU Hiroya"`
		* regular expression `@`
			`"image" : "@^http://\\w*\\.manga24\\.ru/manga/gantz/\\d*/\\d*\\.(png|jpg|jpeg)$"`

	* Сompare numbers

		* equal `=`
			`"mangas_count" : "=460"`
		* not equal `!=`
			`"pages_count" : "!=20"`
		* great `>`
			`"mangas_count" : ">460"`
		* less `<`
			`"genres_count" : "<7"`
		* greater or equal `>=`
			`"mangas_count" : ">=460"`
		* less or equal `<=`
			`"genres_count" : "<=7"`

# Debugging

* **nigma.jar** - console java app for parser debugging.
* **test**, **test.bat** - launching test scripts (wrappers on **nigma.jar**) for MacOs и Windows
* **site_parsers.sublime-project** - project for Sublime Text simplifies the debugging process

Application output reports the passing of tests + logging (if `details : true` for each methods).
For printing the results of each methods you need to run an application with one of the keys: `[manga_list_complete]`, `[manga_complete]`, `[chapter_complete]`, `[page_complete]`.

***Launch testing for site mangafox***
```shell
$./test manga24.json

configuaration ok
1. success( 0,3s)
2. disabled( 0,0s)
3. manga_list_complete success( 1,5s)
4. manga_complete success( 0,2s)
5. chapter_complete success( 0,1s)
6. page_complete success( 0,1s)
Count: 6
Success: 6
Error: 0
Time:  2,2s
Result: 100,0%
```

***Print the result work of method "chapter_complete"***
```shell
$java -jar nigma.jar mangafox [chapter_complete] http://mangafox.me/manga/yureka/v01/c002/ Yureka 2

Chapter link: http://mangafox.me/manga/yureka/v01/c002/
Chapter complete ok!
{
    "first_three_pages": [
        {"link": "http://mangafox.me/manga/yureka/v01/c002/1.html"},
        {"link": "http://mangafox.me/manga/yureka/v01/c002/2.html"},
        {"link": "http://mangafox.me/manga/yureka/v01/c002/3.html"}
    ],
    "link": "http://mangafox.me/manga/yureka/v01/c002/",
    "title": "Yureka"
}
time: 765ms
```
