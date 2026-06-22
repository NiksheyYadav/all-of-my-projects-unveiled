from textblob import TextBlob
from newspaper import article

# url='https://en.wikipedia.org/wiki/Artificial_intelligence'
# article = article.Article(url)
# article.download()
# article.parse()
# article.nlp()

with open('text_hello.txt', 'r') as f:
    text=f.read()

# text = article.text
# text=article.summary
# print("Text: ", text)

blob = TextBlob(text)
sentiment = blob.sentiment.polarity # -1 to 1
print(sentiment)