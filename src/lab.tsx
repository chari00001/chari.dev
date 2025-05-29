import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
}

const CodeBlock = ({ 
  code, 
  language = 'javascript', 
  title, 
  showLineNumbers = true 
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Kopyalama hatası:', error)
    }
  }

  const lines = code.split('\n')

  return (
    <div className="glass-morphism overflow-hidden">
      {/* Header */}
      {title && (
        <div className="bg-darkGray/30 px-4 py-2 border-b border-gray-600/30 flex items-center justify-between">
          <span className="text-sm text-accent font-mono">{title}</span>
          <span className="text-xs text-light/60 font-mono">{language}</span>
        </div>
      )}
      
      {/* Code Container */}
      <div className="relative">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-darkGray/80 hover:bg-darkGray 
                     transition-colors duration-200 rounded-md z-10 group"
          title={copied ? 'Kopyalandı!' : 'Kopyala'}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-light/60 group-hover:text-light transition-colors" />
          )}
        </button>

        {/* Code Content */}
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm font-mono leading-relaxed">
            {showLineNumbers ? (
              <table className="w-full">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="text-light/40 text-right pr-4 select-none min-w-[3ch]">
                        {index + 1}
                      </td>
                      <td className="text-light/90">
                        <code>{line}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <code className="text-light/90">{code}</code>
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}

const Lab = () => {
  const sampleCode = `import java.util.*;

class Resource {
	private int numResources;
	private final int MAX = 5;

	public Resource(int startLevel) {
		numResources = startLevel;
	}

	public int getLevel() {
		return numResources;
	}

	public synchronized void addOne() {
		try {
			while (numResources >= MAX) {
				System.out.println("STACK IS FULL");  // 👈 Hoca bunu istiyor
				wait();
			}

			numResources++;
			System.out.println("PUSHED ITEM = " + numResources);  // 👈 Hoca bunu istiyor

			notifyAll();
		} catch (InterruptedException interruptEx) {
			System.out.println(interruptEx);
		}
	}

	public synchronized int takeOne() {
		try {
			while (numResources == 0) {
				System.out.println("STACK IS EMPTY");  // 👈 Hoca bunu istiyor
				wait();
			}

			System.out.println("POPED ITEM = " + numResources);  // 👈 Hoca bunu istiyor
			numResources--;

			notify();
		} catch (InterruptedException interruptEx) {
			System.out.println(interruptEx);
		}
		return numResources;
	}
}

class Producer implements Runnable {
	private Resource resource;

	public Producer(Resource resource) {
		this.resource = resource;
	}

	public void run() {
		for (int i = 0; i < 10; i++) {
			resource.addOne();
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
}

class Consumer implements Runnable {
	private Resource resource;

	public Consumer(Resource resource) {
		this.resource = resource;
	}

	public void run() {
		for (int i = 0; i < 10; i++) {
			resource.takeOne();
			try {
				Thread.sleep(1500);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
}

public class ProducerConsumerExample {
	public static void main(String[] args) {
		Resource resource = new Resource(0);
		
		Thread producer = new Thread(new Producer(resource));
		Thread consumer = new Thread(new Consumer(resource));
		
		producer.start();
		consumer.start();
	}
}`

  return (
    <div className="min-h-screen bg-dark py-32">
      <div className="container mx-auto px-4">
        <h1 className="section-title mb-12">Kod Laboratuvarı</h1>
        
        <div className="space-y-8">
          <CodeBlock
            code={sampleCode}
            language="java"
            title="ProducerConsumer.java"
            showLineNumbers={true}
          />
          
          <CodeBlock
            code="npm install framer-motion lucide-react"
            language="bash"
            title="Terminal"
            showLineNumbers={false}
          />
        </div>
      </div>
    </div>
  )
}

export default Lab
