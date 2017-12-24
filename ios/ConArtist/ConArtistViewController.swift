//
//  ConArtistViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2017-12-20.
//  Copyright © 2017 Cameron Eldridge. All rights reserved.
//

import UIKit

// TODO: re-evaluate whether this is actually needed, or just bloat

class ConArtistViewController: UIViewController {
    // TODO: this is not the prettiest implementation... might be enough but I haven't got enough experience to judge that yet
    private var onSelfReturnFromSegue: ((Any?) -> Void)? = nil
    private var onTargetReturnFromSegue: ((Any?) -> Void)? = nil
    private var returnValue: Any? = nil

    func setCompletionCallback(to cb: @escaping (Any?) -> Void) {
        self.onSelfReturnFromSegue = cb
    }
    
    /// Performs a segue as usual, but sets up a handler for when the target view controller calls its
    /// corresponding `dismissReturning` method. This requires that both this VC and the target VC are
    /// subclasses of `ConArtistViewController`
    func performSegueForReturnValue(withIdentifier id: String, sender: Any?, completion: @escaping (Any?) -> Void) {
        performSegue(withIdentifier: id, sender: sender)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        (segue.destination as? ConArtistViewController)?.onSelfReturnFromSegue = onTargetReturnFromSegue
        onTargetReturnFromSegue = nil
    }

    /// Performs a regular dismiss segue, but passing the provided data to the callback that was set by
    /// `performSegueForReturnValue`. If the segue was not set up for a return value, the value will
    /// simply be lost.
    func dismissReturning(data: Any?, animated: Bool, completion: (() -> Void)? = nil) {
        dismiss(animated: animated)
        onSelfReturnFromSegue?(data)
    }
}
